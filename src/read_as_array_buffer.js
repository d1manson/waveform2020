// wraps the FileReader readAsArrayBuffer api in a promise
// as suggested https://stackoverflow.com/a/46568146/2399799
export default function(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.readAsArrayBuffer(file);
  });
}
