import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { query } from '../db.js';

dotenv.config();

const ANCHOR_ABI = [
  "function anchorBatch(bytes32 merkleRoot, string memory metadataURI) external",
  "function getBatch(bytes32 merkleRoot) external view returns (string memory)"
];

export async function anchorBatch(batchId) {
  try {
    console.log(`Starting anchor process for batch ${batchId}`);
    
    // Get batch data
    const batchResult = await query(
      'SELECT * FROM batches WHERE id = $1',
      [batchId]
    );

    if (batchResult.rows.length === 0) {
      throw new Error('Batch not found');
    }

    const batch = batchResult.rows[0];
    
    if (!batch.merkle_root) {
      throw new Error('Batch has no merkle root');
    }

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(
      process.env.POLYGON_MUMBAI_RPC || 'http://localhost:8545'
    );
    
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
    
    // Connect to contract
    const contract = new ethers.Contract(
      process.env.ANCHOR_CONTRACT_ADDRESS,
      ANCHOR_ABI,
      wallet
    );

    // Prepare metadata URI (could be IPFS in production)
    const metadataURI = `https://api.blockauthentic.com/batch/${batchId}/metadata`;
    
    // Convert merkle root to bytes32
    const merkleRootBytes = '0x' + batch.merkle_root;
    
    console.log(`Anchoring batch ${batchId} with root ${merkleRootBytes}`);
    
    // Send transaction
    const tx = await contract.anchorBatch(merkleRootBytes, metadataURI);
    console.log(`Transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Update batch with anchor info
    await query(
      'UPDATE batches SET anchor_tx_hash = $1, anchor_block = $2, status = $3 WHERE id = $4',
      [tx.hash, receipt.blockNumber, 'anchored', batchId]
    );

    console.log(`Batch ${batchId} successfully anchored`);
    
  } catch (error) {
    console.error(`Failed to anchor batch ${batchId}:`, error);
    
    // Update batch status to failed
    await query(
      'UPDATE batches SET status = $1 WHERE id = $2',
      ['anchor_failed', batchId]
    );
  }
}

// If run directly
if (process.argv[2]) {
  const batchId = process.argv[2];
  anchorBatch(batchId).then(() => process.exit(0));
}