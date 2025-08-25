class SpcPopupDialog extends HTMLElement {
  static get observedAttributes() { return ['open', 'title']; }

  constructor() {
    super();
  this._onClose = this._onClose.bind(this);
  }

  connectedCallback() {
    // Only set up the structure if not already present
    if (!this.querySelector('dialog')) {
      const dialog = document.createElement('dialog');
      dialog.innerHTML = `
      <section class="popup-component">
        <button class="close-btn" aria-label="Close">&times;</button>
        <div class="header">
          <span class="dialog-title"></span>
        </div>
        <div class="content"></div>
      </section>
      `;
      this.appendChild(dialog);
    }
    this._dialog = this.querySelector('dialog');
    this._titleSpan = this._dialog.querySelector('.dialog-title');
    this._contentDiv = this._dialog.querySelector('.content');
    this._updateTitle();

    // Move all non-dialog child nodes into the dialog's content area
    const nodesToMove = Array.from(this.childNodes).filter(
      node => node !== this._dialog && (node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '')
    );
    nodesToMove.forEach(node => {
      this._contentDiv.appendChild(node);
    });

    this.querySelector('.close-btn').addEventListener('click', this._onClose);
    this._dialog.addEventListener('close', this._onClose);
  }

  disconnectedCallback() {
    this.querySelector('.close-btn').removeEventListener('click', this._onClose);
    this._dialog.removeEventListener('close', this._onClose);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      if (this.hasAttribute('open')) {
        this._show();
      } else {
        this._hide();
      }
    } else if (name === 'title') {
      this._updateTitle();
    }
  }

  _show() {
    if (!this._dialog.open) {
      const openDialog = () => {
        this._dialog.showModal();
        // Wait for dialog to render, then add class for animation
        requestAnimationFrame(() => {
          this._dialog.classList.add('slide-up');
        });
      };
      if (document.startViewTransition) {
        document.startViewTransition(openDialog);
      } else {
        openDialog();
      }
    } else {
      this._dialog.classList.add('slide-up');
    }
  }

  _hide() {
    if (this._dialog.open) {
      // Remove slide-up class for animation
      this._dialog.classList.remove('slide-up');
      if (document.startViewTransition) {
        document.startViewTransition(() => this._dialog.close());
      } else {
        this._dialog.close();
      }
    }
  }

  _onClose() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('popup-closed', { bubbles: true }));
  }

  open() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
  }

  _updateTitle() {
    if (this._titleSpan) {
      this._titleSpan.textContent = this.getAttribute('title') || '';
    }
  }
}

customElements.define('spc-popup-dialog', SpcPopupDialog);
