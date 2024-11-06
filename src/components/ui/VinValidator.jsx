// vinValidator.js
export const vinValidation = {
    /**
     * Formats a VIN by removing non-alphanumeric characters and converting to uppercase
     */
    formatVin: (vin) => {
      if (!vin) return '';
      return vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
    },
  
    /**
     * Checks if a VIN has valid characters and length
     */
    isValidVinFormat: (vin) => {
      if (!vin) return false;
      
      // VIN must be 17 characters
      if (vin.length !== 17) return false;
      
      // Valid VIN characters (excluding I, O, Q)
      const validChars = /^[A-HJ-NPR-Z0-9]+$/;
      return validChars.test(vin);
    },
  
    /**
     * Gets validation error message for a VIN
     */
    getVinError: (vin) => {
      if (!vin) return '';
      
      if (vin.length < 17) {
        return `VIN must be 17 characters (currently ${vin.length})`;
      }
  
      const invalidChars = /[IOQ]/;
      if (invalidChars.test(vin)) {
        return 'VIN cannot contain I, O, or Q';
      }
  
      const validChars = /^[A-HJ-NPR-Z0-9]+$/;
      if (!validChars.test(vin)) {
        return 'VIN can only contain letters (except I,O,Q) and numbers';
      }
  
      return '';
    }
  };