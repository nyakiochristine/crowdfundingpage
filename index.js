document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const modalToggleBtns = document.querySelectorAll('.modal-toggle, .pledge-btn');
    const modalOverlay = document.getElementById('selection-modal');
    const successModal = document.getElementById('success-modal');
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const pledgeConfirms = document.querySelectorAll('.pledge-confirm');
    const radios = document.querySelectorAll('input[name="pledge"]');
    let currentPledgeType = null;

    // Bookmark toggle
    bookmarkBtn.addEventListener('click', () => {
      bookmarkBtn.classList.toggle('active');
      const span = bookmarkBtn.querySelector('span');
      span.textContent = bookmarkBtn.classList.contains('active') ? 'Bookmarked' : 'Bookmark';
    });

    // Open selection modal
    modalToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pledgeType = e.target.dataset.pledge;
        if (pledgeType && pledgeType !== 'mahogany') {
          currentPledgeType = pledgeType;
          document.getElementById(pledgeType).checked = true;
          showPledgeSection(pledgeType);
        }
        modalOverlay.classList.add('active');
      });
    });

    // Radio change handler
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentPledgeType = e.target.dataset.pledge;
          showPledgeSection(currentPledgeType);
        }
      });
    });

    function showPledgeSection(type) {
      document.querySelectorAll('.modal-reward').forEach(el => {
        el.classList.remove('active');
        const inputSection = el.querySelector('.pledge-input-section');
        if (inputSection) inputSection.style.display = 'none';
      });
      
      const targetSection = document.querySelector(`.pledge-${type}`);
      if (targetSection && !targetSection.classList.contains('out-of-stock')) {
        targetSection.classList.add('active');
        const inputSection = targetSection.querySelector('.pledge-input-section');
        if (inputSection) inputSection.style.display = 'block';
      }
    }

    // Pledge confirmation
    pledgeConfirms.forEach(btn => {
      btn.addEventListener('click', () => {
        const pledgeInput = btn.closest('.pledge-input-section').querySelector('.pledge-input');
        const pledgeAmount = parseInt(pledgeInput.value);
        if (pledgeAmount && pledgeAmount >= parseInt(pledgeInput.min)) {
          // Update stats
          const totalEl = document.querySelector('.total');
          const backersEl = document.querySelector('.backers');
          const currentTotal = parseInt(totalEl.dataset.total);
          const currentBackers = parseInt(backersEl.dataset.backers);
          
          totalEl.dataset.total = currentTotal + pledgeAmount;
          totalEl.textContent = `$${currentTotal + pledgeAmount.toLocaleString()}`;
          backersEl.dataset.backers = currentBackers + 1;
          backersEl.textContent = (currentBackers + 1).toLocaleString();
          
          // Close modals and show success
          modalOverlay.classList.remove('active');
          successModal.classList.add('active');
        }
      });
    });

    // Close modals
    document.querySelector('.modal-close').addEventListener('click', closeModals);
    document.getElementById('selection-modal').addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModals();
    });
    document.getElementById('success-modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) closeModals();
    });

    function closeModals() {
      modalOverlay.classList.remove('active');
      successModal.classList.remove('active');
      radios.forEach(r => r.checked = false);
      document.querySelectorAll('.pledge-input-section').forEach(s => s.style.display = 'none');
      currentPledgeType = null;
    }
});
  