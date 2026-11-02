(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var themeToggle = document.querySelector('[data-theme-toggle]');
  var themeColor = document.getElementById('theme-color');

  function applyTheme(theme, persist) {
    var next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    root.style.colorScheme = next;

    if (themeColor) {
      themeColor.setAttribute('content', next === 'light' ? '#F6F6F2' : '#09090B');
    }

    if (themeToggle) {
      var target = next === 'light' ? 'dark' : 'light';
      themeToggle.setAttribute('aria-label', 'Switch to ' + target + ' theme');
      themeToggle.setAttribute('title', 'Switch to ' + target + ' theme');
    }

    if (persist) {
      try {
        localStorage.setItem('theme', next);
      } catch (error) {}
    }
  }

  applyTheme(root.dataset.theme, false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
    });
  }

  var header = document.querySelector('.site-header');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var navSections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);
  var ticking = false;

  function updateOnScroll() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    var marker = 150;
    var current = '';

    navSections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= marker && rect.bottom > marker) {
        current = '#' + section.id;
      }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = '#contact';
    }

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === current);
    });

    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  updateOnScroll();

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (item) {
        item.classList.remove('is-active');
      });
      link.classList.add('is-active');
      closeMenu();
    });
  });

  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  var mobileLinks = mobileMenu
    ? Array.prototype.slice.call(mobileMenu.querySelectorAll('a'))
    : [];

  function setMenuState(open) {
    body.classList.toggle('menu-open', open);

    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    }

    if (mobileMenu) {
      mobileMenu.setAttribute('aria-hidden', String(!open));
      mobileMenu.inert = !open;
    }
  }

  function closeMenu() {
    setMenuState(false);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      setMenuState(!body.classList.contains('menu-open'));
    });
  }

  if (mobileMenu) {
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    setMenuState(false);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenu();
      if (menuToggle) {
        menuToggle.focus();
      }
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  var revealElements = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  var flowRows = Array.prototype.slice.call(document.querySelectorAll('[data-node]'));
  var detailLabel = document.querySelector('[data-detail-label]');
  var detailText = document.querySelector('[data-detail-text]');

  flowRows.forEach(function (row) {
    row.addEventListener('click', function () {
      flowRows.forEach(function (item) {
        item.classList.remove('is-active');
        item.setAttribute('aria-pressed', 'false');
      });

      row.classList.add('is-active');
      row.setAttribute('aria-pressed', 'true');

      if (detailLabel && detailText) {
        var index = row.querySelector('.flow-index');
        detailLabel.textContent = (index ? index.textContent.trim() : '') + ' / ' + row.dataset.label;
        detailText.textContent = row.dataset.detail || '';
      }
    });
  });

  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
  var archLayers = Array.prototype.slice.call(document.querySelectorAll('[data-layer]'));
  var archLabel = document.querySelector('[data-arch-label]');
  var archDetail = document.querySelector('[data-arch-detail]');

  function showStep(step) {
    var number = step.dataset.step;
    var title = step.querySelector('.step-copy b');
    var activeLayers = (step.dataset.layers || '').split(',');

    steps.forEach(function (item) {
      item.classList.toggle('is-active', item === step);
    });

    archLayers.forEach(function (layer) {
      var active = activeLayers.indexOf(layer.dataset.layer) !== -1;
      layer.classList.toggle('is-active', active);
      layer.classList.toggle('is-dim', !active);
    });

    if (archLabel) {
      archLabel.textContent = 'STEP ' + number + ' / ' + (title ? title.textContent.toUpperCase() : '');
    }

    if (archDetail) {
      archDetail.textContent = step.dataset.detail || '';
    }
  }

  steps.forEach(function (step) {
    step.addEventListener('click', function () {
      showStep(step);
    });
  });

  archLayers.forEach(function (layer) {
    layer.addEventListener('click', function () {
      var title = layer.querySelector('b');

      archLayers.forEach(function (item) {
        item.classList.toggle('is-active', item === layer);
        item.classList.toggle('is-dim', item !== layer);
      });

      if (archLabel) {
        archLabel.textContent = 'LAYER / ' + (title ? title.textContent.toUpperCase() : '');
      }

      if (archDetail) {
        archDetail.textContent = layer.dataset.detail || '';
      }
    });
  });

  var dialogs = Array.prototype.slice.call(document.querySelectorAll('.case-dialog'));
  var lastFocused = null;

  function openCase(name) {
    var dialog = document.getElementById('case-' + name);

    if (!dialog || typeof dialog.showModal !== 'function') {
      return;
    }

    closeMenu();
    lastFocused = document.activeElement;
    dialog.showModal();
    body.classList.add('dialog-open');

    var shell = dialog.querySelector('.case-shell');
    if (shell) {
      shell.scrollTop = 0;
    }
  }

  function closeDialog(dialog) {
    if (dialog.open) {
      dialog.close();
    }
  }

  document.querySelectorAll('[data-case]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openCase(trigger.dataset.case);
    });
  });

  dialogs.forEach(function (dialog) {
    var closeButton = dialog.querySelector('[data-close-case]');

    if (closeButton) {
      closeButton.addEventListener('click', function () {
        closeDialog(dialog);
      });
    }

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) {
        closeDialog(dialog);
      }
    });

    dialog.addEventListener('close', function () {
      var anyOpen = dialogs.some(function (item) {
        return item.open;
      });

      if (!anyOpen) {
        body.classList.remove('dialog-open');
      }

      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    });
  });

  var copyButton = document.querySelector('[data-copy-email]');
  var copyLabel = document.querySelector('[data-copy-label]');
  var email = 'saipavankistamsetty@gmail.com';

  function legacyCopy(value) {
    var field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();

    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {}

    document.body.removeChild(field);
    return copied;
  }

  if (copyButton && copyLabel) {
    copyButton.addEventListener('click', function () {
      function finish(success) {
        copyLabel.textContent = success ? 'Copied' : 'Copy failed';
        window.setTimeout(function () {
          copyLabel.textContent = 'Copy email';
        }, 1900);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(
          function () {
            finish(true);
          },
          function () {
            finish(legacyCopy(email));
          }
        );
      } else {
        finish(legacyCopy(email));
      }
    });
  }

  var form = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (form) {
    var nameField = document.getElementById('contact-name');
    var emailField = document.getElementById('contact-email');
    var messageField = document.getElementById('contact-message');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setFieldError(field, message) {
      var error = document.getElementById(field.id + '-error');
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) {
        error.textContent = message;
      }
      return !message;
    }

    function validateName() {
      var value = nameField.value.trim();
      return setFieldError(nameField, value.length < 2 ? 'Please enter your name.' : '');
    }

    function validateEmail() {
      var value = emailField.value.trim();
      return setFieldError(emailField, emailPattern.test(value) ? '' : 'Please enter a valid email address.');
    }

    function validateMessage() {
      var value = messageField.value.trim();
      return setFieldError(messageField, value.length < 10 ? 'Please add a little more detail (at least 10 characters).' : '');
    }

    [
      [nameField, validateName],
      [emailField, validateEmail],
      [messageField, validateMessage]
    ].forEach(function (pair) {
      var field = pair[0];
      var validator = pair[1];

      if (field) {
        field.addEventListener('input', function () {
          if (field.getAttribute('aria-invalid') === 'true') {
            validator();
          }
        });

        field.addEventListener('blur', function () {
          if (field.value.trim()) {
            validator();
          }
        });
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var validName = validateName();
      var validEmail = validateEmail();
      var validMessage = validateMessage();
      var valid = validName && validEmail && validMessage;

      if (formStatus) {
        formStatus.classList.toggle('is-error', !valid);
      }

      if (!valid) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        if (formStatus) {
          formStatus.textContent = 'Please fix the highlighted fields.';
        }
        return;
      }

      var name = nameField.value.trim();
      var senderEmail = emailField.value.trim();
      var message = messageField.value.trim();
      var subject = 'Portfolio inquiry from ' + name;
      var bodyText = 'Name: ' + name + '\nEmail: ' + senderEmail + '\n\n' + message;
      var mailto =
        'mailto:' +
        email +
        '?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(bodyText);

      if (formStatus) {
        formStatus.textContent = 'Opening your email app with a pre-filled draft…';
      }

      window.location.href = mailto;

      window.setTimeout(function () {
        if (formStatus) {
          formStatus.textContent =
            'Your email app should open. If it does not, write to ' + email + ' directly.';
        }
      }, 1400);
    });
  }

  document.querySelectorAll('[data-year]').forEach(function (year) {
    year.textContent = String(new Date().getFullYear());
  });
})();
