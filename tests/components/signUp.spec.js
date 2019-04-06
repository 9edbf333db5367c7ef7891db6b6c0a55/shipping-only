import { shallowMount } from '@vue/test-utils';
import SignUp from '@app/components/signUp.vue';

const factory = (values = {}) =>
  shallowMount(SignUp, {
    data: {
      ...values,
    },
  });

describe('SignUp', () => {
  it('exists', () => {
    const wrapper = factory();
    assert.isTrue(wrapper.exists());
  });

  it('have SignUp name', () => {
    const wrapper = factory();
    assert.equal(wrapper.name(), 'SignUp');
  });

  it('auth data have default props value on start', () => {
    const wrapper = factory();
    const inputPropValues = wrapper.vm.valuesToValidate;
    const selectsPropValues = wrapper.vm.selectsToValidate;

    inputPropValues.forEach((prop) => {
      assert.isUndefined(wrapper.vm.itemToValidate[prop]);
    });

    selectsPropValues.forEach((prop) => {
      assert.isEmpty(wrapper.vm.itemToValidate[prop]);
    });
  });

  describe('sign up form', () => {
    it('should be visible when user has not being signed up yet', () => {
      const wrapper = factory();
      const form = wrapper.find('form');
      assert.isFalse(wrapper.vm.isSignedUp, 'isSignedUp variable should be false');
      assert.isTrue(form.isVisible(), 'form should be visible');
    });

    it('should not be visible when user has being signed up yet', () => {
      const wrapper = factory();
      const form = wrapper.find('form');
      wrapper.vm.isSignedUp = true;
      assert.isFalse(form.isVisible(), 'form should not be visible');
    });
  });

  describe('names Input', () => {
    it('should be rendered', () => {
      const wrapper = factory();
      const nameInput = wrapper.find('#names');
      assert.isTrue(nameInput.exists());
    });

    it('value entered should set and equal auth.names', () => {
      const wrapper = factory();
      const nameInput = wrapper.find('#names');
      expect(wrapper.vm.itemToValidate.names, 'auth.names should be undefined').to.be.undefined;
      assert.isUndefined(wrapper.vm.itemToValidate.names, 'auth.names should be undefined');
      nameInput.setValue('Jane Doe');
      assert.equal(wrapper.vm.itemToValidate.names, 'Jane Doe', 'auth.names should equal Jane Doe');
    });

    it('error message span should be shown when validation is invalid', () => {
      const wrapper = factory();
      const errorSpan = wrapper.find('#names+.invalid-feedback');
      assert.isNotTrue(errorSpan.isVisible(), 'Expect errorspan to not be visible');
      wrapper.vm.validation.names.invalid = true;
      assert.isTrue(errorSpan.isVisible(), 'Expect errorspan to be visible');
    });

    it('show error when less than two names are written', () => {
      const wrapper = factory();
      const nameInput = wrapper.find('#names');
      const errorSpan = wrapper.find('#names+.invalid-feedback');
      assert.isFalse(
        errorSpan.isVisible(),
        'nameInput error span should be hidden when there is no error'
      );
      nameInput.setValue('John');
      nameInput.trigger('keyup');
      assert.isTrue(
        errorSpan.isVisible(),
        'nameInput error span should be visible when only one name is given'
      );
    });

    it('show no error when more than two names are written', () => {
      const wrapper = factory();
      const nameInput = wrapper.find('#names');
      const errorSpan = wrapper.find('#names+.invalid-feedback');
      assert.isFalse(
        errorSpan.isVisible(),
        'nameInput error span should be hidden when there is no error'
      );
      nameInput.setValue('Jane Doe');
      nameInput.trigger('keyup');
      assert.isFalse(
        errorSpan.isVisible(),
        'nameInput error span should not be visible when two names are given'
      );
    });
  });

  describe('email Input', () => {
    it('should be rendered', () => {
      const wrapper = factory();
      const emailInput = wrapper.find('#email');
      assert.isTrue(emailInput.exists());
    });

    it('value entered should set and equal auth.email', () => {
      const wrapper = factory();
      const emailInput = wrapper.find('#email');
      const emailText = 'email@ldd.com';
      assert.isUndefined(wrapper.vm.itemToValidate.email, 'auth.email should be undefined');
      emailInput.setValue(emailText);
      assert.equal(wrapper.vm.itemToValidate.email, emailText, 'auth.email should equal Jane Doe');
    });

    it('error message span should be shown when validation is invalid', () => {
      const wrapper = factory();
      const errorSpan = wrapper.find('#email+.invalid-feedback');
      assert.isNotTrue(errorSpan.isVisible(), 'Expect errorspan to not be visible');
      wrapper.vm.validation.email.invalid = true;
      assert.isTrue(errorSpan.isVisible(), 'Expect errorspan to be visible');
    });

    it('show error when wrong email format is written', () => {
      const wrapper = factory();
      const emailInput = wrapper.find('#email');
      const errorSpan = wrapper.find('#email+.invalid-feedback');
      assert.isNotTrue(
        errorSpan.isVisible(),
        'emailInput error span should be hidden when there is no error'
      );
      emailInput.setValue('Mldo.d');
      emailInput.trigger('keyup');
      assert.isTrue(
        errorSpan.isVisible(),
        'emailInput error span should be visible when only when wrong email format is given'
      );
    });

    it('show no error when correct email format is given', () => {
      const wrapper = factory();
      const emailInput = wrapper.find('#email');
      const errorSpan = wrapper.find('#email+.invalid-feedback');
      assert.isFalse(
        errorSpan.isVisible(),
        'emailInput error span should be hidden when there is no error'
      );
      emailInput.setValue('ldondd@gedd.com');
      emailInput.trigger('keyup');
      assert.isFalse(
        errorSpan.isVisible(),
        'emailInput error span should not be visible when correct email format is given'
      );
    });
  });
  describe('role select', () => {
    it('should be rendered', () => {
      const wrapper = factory();
      const roleSelect = wrapper.find('#role');
      assert.isTrue(roleSelect.exists());
    });

    it('value selected should set and equal auth.role', () => {
      const wrapper = factory();
      const roleSelect = wrapper.find('#role');
      assert.isEmpty(wrapper.vm.itemToValidate.role, 'auth.role should be empty');
      const roleOptions = roleSelect.findAll('option');
      roleOptions.at(1).setSelected();
      assert.equal(wrapper.vm.itemToValidate.role, '1', 'auth.role should equal "1"');
    });
  });

  describe('sign-up button', () => {
    it('should be rendered', () => {
      const wrapper = factory();
      const signUpButton = wrapper.find('.btn-signin');
      assert.isTrue(signUpButton.exists());
    });

    it('should be enabled only when all value are valid', () => {
      const wrapper = factory();
      const signUpButton = wrapper.find('.btn-signin');
      const roleSelect = wrapper.find('#role');
      const emailInput = wrapper.find('#email');
      const nameInput = wrapper.find('#names');
      const passWordInput = wrapper.find('#password');

      const enterDetails = (email, name, password, roleValue) => {
        emailInput.setValue(email);
        emailInput.trigger('keyup');
        nameInput.setValue(name);
        nameInput.trigger('keyup');
        passWordInput.setValue(password);
        nameInput.trigger('keyup');
        const roleOptions = roleSelect.findAll('option');
        roleOptions.at(roleValue).setSelected();
      };
      assert.isTrue(signUpButton.is('[disabled]'), 'should start disabled');

      enterDetails('lets@email.com', 'Two Names', 'JustPassword', 1);
      assert.isFalse(signUpButton.is('[disabled]'), 'should be enabled');

      enterDetails('lenf', 'ld', 'ldf', 1);
      assert.isTrue(signUpButton.is('[disabled]'), 'should be disabled again');
    });
  });
});
