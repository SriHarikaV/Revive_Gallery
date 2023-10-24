export function generateRandomUid() {
  const timestamp = new Date().getTime().toString(16); // Convert current timestamp to hex
  const randomPart = Math.random().toString(16).substr(2, 8); // Generate random hex string

  const uid = timestamp + randomPart;

  return uid;
}
