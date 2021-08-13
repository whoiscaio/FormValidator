class FormValidator {
  constructor() {
    this.inputs = document.querySelectorAll('label input');
    this.button = document.querySelector('form button[type="submit"]');
    this.valid = 0;

    this.retain();

    this.inputs.forEach(input =>
      input.addEventListener('blur', e => this.validate(e))
    );
  }

  validate(e) {
    const input = e.target;

    if (!this.isNotNull(input)) {
      return this.throwError(
        `O campo ${input.placeholder} não pode estar vazio.`,
        input
      );
    } else {
      this.cleanError(input);
    }

    let feedback = this.specificValidations(input);

    if(feedback === 'suceed') {
      this.liberate();
    }
  }

  isNotNull(input) {
    return input.value;
  }

  liberate() {
    console.log(this.valid);
    if(this.valid === 6) {
      this.button.disabled = false;
    }
  }

  retain() {
    this.button.disabled = true;
  }

  specificValidations(input) {
    const { value } = input;

    switch (input.id) {
      case 'name':
        if (!this.validateName(value)) {
          return this.throwError(
            `O ${input.placeholder} precisa ter pelo menos 3 caracteres.`,
            input
          );
        }
        this.valid++;
        break;
      case 'surname':
        this.valid++;
        break;
      case 'email':
        if (!this.validateEmail(value)) {
          return this.throwError('O email informado não é válido', input);
        }
        this.valid++;
        break;
      case 'cpf':
        if(!this.validateCPF(value)) {
          return this.throwError('O CPF informado não é válido', input)
        }
        this.valid++;
        break;
      case 'password':
        let error = this.validatePassword(value);

        if (typeof error !== 'boolean') {
          return this.throwError(error, input);
        }
        this.valid++;
        break;
      case 'confirm-password':
        if (!this.confirmPassword(value)) {
          return this.throwError('As senhas informadas não coincidem', input);
        }
        this.valid++;
        break;
    }

    return 'suceed';
  }

  validateName(value) {
    return value.length >= 3;
  }

  validateEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  validateCPF(value) {
    const regex = /[0-9]{3}[/.]?[0-9]{3}[/.]?[0-9]{3}[-]?[0-9]{2}/;

    return regex.test(value) ? this.validateCPFDigit(value) : false;
  }

  validateCPFDigit(value) {
    function getDigit(cpf) {
      let reverse = cpf.length + 1;
      let sum = 0;
      let digit;

      for(let i = 0; i < cpf.length; i++) {
        sum += cpf[i] * reverse;
        reverse--;
      }

      digit = 11 - (sum % 11);

      return digit > 9 ? 0 : digit;
    }

    let filteredCPF = value.split(/[.-]/).join('');
    let trimmedCPF = filteredCPF.substr(0, 9);

    trimmedCPF += getDigit(trimmedCPF);
    trimmedCPF += getDigit(trimmedCPF);

    console.log(trimmedCPF);

    return trimmedCPF === filteredCPF;
  }

  validatePassword(value) {
    const lowercaseLetters = /[a-z]/;
    const uppercaseLetters = /[A-Z]/;
    const numbers = /[0-9]/;
    const symbols = /[^a-zA-Z0-9]/;

    if (!lowercaseLetters.test(value)) {
      return 'A senha precisa ter pelo menos uma letra minúscula';
    }

    if (!uppercaseLetters.test(value)) {
      return 'A senha precisa ter pelo menos uma letra maiúscula';
    }

    if (!numbers.test(value)) {
      return 'A senha precisa ter pelo menos um número';
    }

    if (!symbols.test(value)) {
      return 'A senha precisa ter pelo menos um caracter especial';
    }

    if (value.length < 8) {
      return 'A senha precisa ter pelo menos 8 caracteres';
    }

    return true;
  }

  confirmPassword(value) {
    const passwordField = document.querySelector('#password');

    return value === passwordField.value;
  }

  throwError(error, element) {
    const errorElement = document.createElement('span');
    errorElement.classList.add('error');
    errorElement.innerText = error;

    this.cleanError(element);
    element.insertAdjacentElement('afterend', errorElement);
    this.errors++;
    this.retain();
    console.log(this.errors);
  }

  cleanError(element) {
    while (element.nextElementSibling) {
      element.nextElementSibling.remove();
      this.errors--;
      console.log(this.errors);
    }
  }
}

const validate = new FormValidator();
