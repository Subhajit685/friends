export const imageFileToDataURI = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => resolve(reader.result); // Resolve with Data URI
      reader.onerror = (error) => reject(error); // Reject on error
      
      reader.readAsDataURL(file); // Read the file as Data URI
    });
  }
