
function validateInput(input) {
    if (input.id == 'username') {
      validateUsername(input);
    }

    if (input.id == 'password' || input.id == 'newPassword') {
      validatePassword(input);
    }

    if (input.id == 'email') {
      validateEmail(input);
    }

    if (input.id == 'age') {
      validateAge(input);
    }

    function validateUsername(input) {
      const username = input.value.trim();
      const hasAlphabet = /[a-zA-Z]/.test(username);
      const hasNumber = /\d/.test(username);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(username); // Add more special characters as needed
      const errors = [];

      if (!hasAlphabet) {
          errors.push('Must contain at least one alphabet.');
      }

      if (!hasNumber) {
          errors.push('Must contain at least one number.');
      }

      if (hasSpecialCharacter) {
          errors.push('Must not contain special characters.');
      }

      if (username.length >= 16) {
          errors.push('Must be less than 16 characters.');
      }

      const isValid = errors.length === 0;

      if (isValid) {
          input.className = input.className.replace(/\b(focus:border-blue-700|focus:border-red-600)\b/g, 'focus:border-green-500');
          document.getElementById('usernameError').innerText = '';
      } else {
          input.className = input.className.replace(/\b(focus:border-blue-700|focus:border-green-500)\b/g, 'focus:border-red-600');
          document.getElementById('usernameError').innerText = errors.join(' ');
      }
  }
  
    function validatePassword(input) {
      const password = input.value.trim();

      const hasAlphabet = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const errors = [];

      if (!hasAlphabet) {
          errors.push('Must contain at least one alphabet.');
      }

      if (!hasNumber) {
          errors.push('Must contain at least one number.');
      }

      if (!hasSpecialCharacter) {
          errors.push('Must contain special characters.');
      }

      if (password.length < 8 || password.length > 16) {
          errors.push('Must be between 8 and 16 characters.');
      }

      const isValid = errors.length === 0;

      if (isValid) {
          input.className = input.className.replace(/\b(focus:border-blue-700|focus:border-red-600)\b/g, 'focus:border-green-500');
          document.getElementById('passwordError').innerText = '';
      } else {
          input.className = input.className.replace(/\b(focus:border-blue-700|focus:border-green-500)\b/g, 'focus:border-red-600');
          document.getElementById('passwordError').innerText = errors.join(' ');
      }
  }
  
    function validateEmail(input) {
    const email = input.value.trim();

    const validEmail =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
    const errors = [];

    if (!validEmail) {
      errors.push('Must be a valid email.');
    }

    const isValid = errors.length === 0;

    if (isValid) {
        input.className = input.className.replace(/\b(focus:border-blue-700|focus:border-red-600)\b/g, 'focus:border-green-500');
        document.getElementById('emailError').innerText = '';
    } else {
        input.className = input.className.replace(/\b(focus:border-blue-700|focus:border-green-500)\b/g, 'focus:border-red-600');
        document.getElementById('emailError').innerText = errors.join(' ');
    }
  }
  
    function validateAge(input) {
    const age = input.value.trim();

    const errors = [];

    if (age < 16 || age > 100) {
      errors.push('Age must be between 16 and 100');
    }

    const isValid = errors.length === 0;

    if (isValid) {
        input.className = input.className.replace(/\b(focus:border-blue-700|focus:border-red-600)\b/g, 'focus:border-green-500');
        document.getElementById('ageError').innerText = '';
    } else {
        input.className = input.className.replace(/\b(focus:border-blue-700|focus:border-green-500)\b/g, 'focus:border-red-600');
        document.getElementById('ageError').innerText = errors.join(' ');
    }
  }
  
  }

  function validateForm() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input');

    for (const input of inputs) {
            validateInput(input);

            // If any input has an error, do not continue
            if (input.nextElementSibling.textContent !== '') {
                return false;
            }
        }
  }

    function togglePasswordVisibility() {
        var passwordInput = document.getElementById('password');
        var togglePassword = document.getElementById('togglePassword');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>'; // Font Awesome eye-slash icon
        } else {
            passwordInput.type = 'password';
            togglePassword.innerHTML = '<i class="fa-solid fa-eye"></i>'; // Font Awesome eye icon
        }
    }

