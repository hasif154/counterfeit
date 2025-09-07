import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export function buildMerkleTree(pids) {
  // Hash each PID
  const leaves = pids.map(pid => keccak256(pid));
  
  // Create merkle tree
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  
  // Return root as hex string
  return tree.getRoot().toString('hex');
}

export function getMerkleProof(pids, targetPid) {
  const leaves = pids.map(pid => keccak256(pid));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  
  const leaf = keccak256(targetPid);
  const proof = tree.getProof(leaf);
  
  return proof.map(p => p.data.toString('hex'));
}