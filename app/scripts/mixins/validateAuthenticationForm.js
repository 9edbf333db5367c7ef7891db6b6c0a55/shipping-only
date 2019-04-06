export default {
  data() {
    return {
      itemToValidate: {},
      formInputsAreInvalid: true,
      errorMessage: null,
      notificationMessage: null,
    };
  },
  methods: {
    validateAuthenticationForm() {
      this.valuesToValidate.forEach((input) => {
        const userInputIsValid = this.validation[input].regexp.test(
          (this.itemToValidate[input] || ' ').trim()
        );

        this.validation[input].invalid = false;

        if (this.itemToValidate[input] && !userInputIsValid) {
          this.validation[input].invalid = true;
          this.firstInvalidFormInput = input;
        }
      });

      let allFormValuesFilled = this.valuesToValidate.every(
        (prop) =>
          typeof this.itemToValidate[prop] === 'string' && this.itemToValidate[prop].length !== 0
      );

      if (allFormValuesFilled && this.selectsToValidate && this.selectsToValidate.length) {
        const allSelectsFieldSelected = this.selectsToValidate.every(
          (prop) => prop in this.itemToValidate && this.itemToValidate[prop]
        );
        allFormValuesFilled = allSelectsFieldSelected;
      }
      // File Input validation
      if (allFormValuesFilled && this.filesToValidate && this.filesToValidate.length >= 1) {
        const allfilesValidated = this.filesToValidate.every(
          (prop) => prop in this.itemToValidate && this.itemToValidate[prop]
        );
        allFormValuesFilled = allfilesValidated;
      }
      // File Input validation
      if (allFormValuesFilled && this.filesToValidate && this.filesToValidate.length >= 1) {
        const allfilesValidated = this.filesToValidate.every(
          (prop) => prop in this.itemToValidate && this.itemToValidate[prop]
        );
        allFormValuesFilled = allfilesValidated;
      }

      const allFormValuesAreValid = Object.keys(this.validation).every(
        (key) => !this.validation[key].invalid
      );
      const formInputsAreInvalid = !(allFormValuesFilled && allFormValuesAreValid);

      if (!formInputsAreInvalid) this.errorMessage = null;
      Object.assign(this, {
        formInputsAreInvalid,
      });
    },
  },
};
