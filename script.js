(function () {
  'use strict';

  //taking section ID from URL
  function getIdFromUrl(url) {
    const regex = /\/sections\/(\d+)-/; 
    const matches = url.match(regex);
  
    if (matches && matches.length === 2) {
      const idWithoutDash = matches[1];
      return idWithoutDash;
    }
  
    return null;
  }

  function getLanguageFromUrl(url) {
    const match = url.match(/hc\/([^\/]+)/);
    return match ? match[1] : null;
  }

  //displaying Category List on the Section and Article Pages
  const url = window.location.href;

  function getDomainFromUrl(url) {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  }

  const domain = getDomainFromUrl(url);
  const locale = getLanguageFromUrl(url);

  let categoriesAndSections = [];
  const categoriesUrl = `https://${domain}/api/v2/help_center/${locale}/categories.json`;
  const sectionsUrl = `https://${domain}/api/v2/help_center/${locale}/sections.json`;
  
  const contentContainer = document.querySelector('.nav__list');
  
  function fetchCategories() {
    return fetch(categoriesUrl)
      .then(response => response.json())
      .then(data => data.categories);
  }
  
  function fetchSections() {
    return fetch(sectionsUrl)
      .then(response => response.json())
      .then(data => data.sections);
  }
  
  if(url.includes('sections') || url.includes('articles')) {
    Promise.all([fetchCategories(), fetchSections()])
      .then(([categories, sections]) => {
        categoriesAndSections = categories.map(category => ({
          category: category,
          sections: sections.filter(section => section.category_id === category.id)
        }));
    
      if(contentContainer){
        categoriesAndSections.forEach(categoryAndSections => {
          const categoryBlock = document.createElement('div');
          categoryBlock.classList.add('nav__category');
          const categoryElement = document.createElement('div');
          categoryElement.classList.add('nav__heading');
          const categoryHeading = document.createElement('h6');
          const sectionsBlock = document.createElement('div');
          sectionsBlock.classList.add('nav__sections');
          categoryHeading.textContent = categoryAndSections.category.name;
          categoryElement.appendChild(categoryHeading)
          const svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none"> <g opacity="0.4"> <path d="M9.9875 0.684387L11 1.68791L6 6.6496L1 1.68791L2.0125 0.684388L6 4.63945L9.9875 0.684387Z" fill="#111111"/> <path d="M10.1283 0.542338L9.98745 0.402744L9.84666 0.542389L6 4.35775L2.15334 0.54239L2.01255 0.402745L1.87171 0.542338L0.85921 1.54586L0.715977 1.68782L0.859123 1.82987L5.85912 6.79156L6 6.93136L6.14088 6.79156L11.1409 1.82987L11.284 1.68782L11.1408 1.54586L10.1283 0.542338Z" stroke="#111111" stroke-opacity="0.75" stroke-width="0.4"/> </g> </svg>';
          const parser = new DOMParser();
          let svgElement = parser.parseFromString(svgString, 'image/svg+xml').querySelector('svg');
          categoryElement.appendChild(svgElement)
          categoryBlock.appendChild(categoryElement);
          contentContainer.appendChild(categoryBlock);
    
          categoryAndSections.sections.forEach(section => {
            const sectionElement = document.createElement('a');
            sectionElement.textContent = section.name;
            sectionElement.setAttribute('href', section.html_url)
            sectionsBlock.appendChild(sectionElement);
            categoryBlock.appendChild(sectionsBlock);
            const sectionId = getIdFromUrl(window.location.href) 
            const sectionArticle = document.querySelector('.section-id');
            let sectionIdArticle = ''
            if(sectionArticle){
              sectionIdArticle = sectionArticle.innerText
            }
            if(section.id == sectionId || section.id == sectionIdArticle){
              categoryElement.classList.add('active');
              sectionsBlock.classList.add('open');
              sectionElement.classList.add('active')
            }
          });
          contentContainer.appendChild(categoryBlock);
        });
        //implementing sidebar navigation toggle on the Section and Article Pages
        const navItems = document.querySelectorAll('.nav__category');
        navItems.forEach((item) => {
          const heading = item.querySelector('.nav__heading');
          const content = item.querySelector('.nav__sections');
          if(heading && content){
            heading.addEventListener('click', function() {
              this.classList.toggle('active');
              content.classList.toggle('open');
            })
          }
        })
      }
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Popular Keywords
  const keywordsElement = document.querySelector('.popular-keywords');

  if (keywordsElement) {
    const keywordsValue = keywordsElement.getAttribute('data-keywords').split(',');

    keywordsValue.forEach(function(keyword) {
      const safeKeyword = encodeURIComponent(keyword.trim());
      const safeDomain = encodeURIComponent(domain.trim()); 
      let linkText = document.createTextNode(keyword.trim());
      let link = document.createElement("a");
      link.setAttribute("href", `https://${safeDomain}/hc/search?query=${safeKeyword}`);
      link.appendChild(linkText);
      keywordsElement.appendChild(link);
    });
  }


  //changing Like and Dislike images on the Article Page
  const buttonUp = document.querySelector('.article-vote-up');
  const buttonDown = document.querySelector('.article-vote-down');

  if(buttonUp && buttonDown){
    buttonUp.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
      <g clip-path="url(#clip0_431_562)">
        <path d="M20.179 9.19498C20.179 8.92139 20.1255 8.65049 20.0217 8.39772C19.9178 8.14496 19.7655 7.9153 19.5736 7.72184C19.3816 7.52839 19.1537 7.37493 18.9029 7.27023C18.6522 7.16554 18.3834 7.11165 18.1119 7.11165H12.8937C12.8611 7.11158 12.8289 7.10372 12.7999 7.08872C12.7708 7.07372 12.7457 7.05199 12.7266 7.02533C12.7075 6.99867 12.6949 6.96782 12.6899 6.93531C12.6849 6.90281 12.6876 6.86957 12.6978 6.83832C13.1542 5.67234 13.3024 4.40685 13.1277 3.16582C12.6415 1.41998 11.6113 0.915815 10.8051 1.02832C10.4092 1.09621 10.0513 1.30702 9.79825 1.62138C9.54522 1.93574 9.41435 2.33217 9.43008 2.73665C9.43008 5.02498 7.66974 7.52498 6.09461 8.62082C6.03947 8.65917 5.9944 8.71046 5.96328 8.77027C5.93217 8.83008 5.91595 8.89662 5.91602 8.96415V17.3941C5.916 17.4909 5.94941 17.5847 6.01051 17.6594C6.07162 17.734 6.1566 17.7849 6.25089 17.8033C6.54607 17.8608 6.81396 17.9158 7.06698 17.97C8.17957 18.2371 9.31992 18.3689 10.4636 18.3625H15.8381C17.4562 18.3625 17.6985 17.4458 17.6985 16.9041C17.6986 16.6168 17.633 16.3334 17.5067 16.0758C17.9434 15.8528 18.2752 15.4652 18.43 14.9971C18.5848 14.529 18.5501 14.0183 18.3335 13.5758C18.6399 13.4189 18.8972 13.1796 19.077 12.8845C19.2568 12.5893 19.352 12.2497 19.3522 11.9033C19.3527 11.5911 19.2751 11.2839 19.1264 11.01C19.4458 10.8287 19.7116 10.565 19.8965 10.2461C20.0815 9.92717 20.179 9.5644 20.179 9.19498Z" fill="white"/>
        <path d="M4.67587 8.98665C4.67587 8.76564 4.58876 8.55368 4.43369 8.3974C4.27863 8.24112 4.06832 8.15332 3.84903 8.15332H1.1618C0.942509 8.15332 0.732199 8.24112 0.577137 8.3974C0.422074 8.55368 0.334961 8.76564 0.334961 8.98665L0.334961 18.1533C0.334961 18.3743 0.422074 18.5863 0.577137 18.7426C0.732199 18.8989 0.942509 18.9867 1.1618 18.9867H3.84903C4.06832 18.9867 4.27863 18.8989 4.43369 18.7426C4.58876 18.5863 4.67587 18.3743 4.67587 18.1533V8.98665ZM3.43561 16.695C3.43561 16.8186 3.39924 16.9394 3.3311 17.0422C3.26296 17.145 3.16611 17.2251 3.05279 17.2724C2.93948 17.3197 2.81479 17.3321 2.6945 17.308C2.57421 17.2839 2.46371 17.2243 2.37698 17.1369C2.29026 17.0495 2.23119 16.9382 2.20727 16.8169C2.18334 16.6957 2.19562 16.57 2.24256 16.4558C2.28949 16.3416 2.36897 16.244 2.47095 16.1753C2.57293 16.1066 2.69283 16.07 2.81548 16.07C2.97995 16.07 3.13768 16.1358 3.25398 16.253C3.37028 16.3703 3.43561 16.5292 3.43561 16.695Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_431_562">
          <rect width="19.8442" height="20" fill="white" transform="translate(0.334961)"/>
        </clipPath>
      </defs>
    </svg>
    `;
    buttonDown.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
      <g clip-path="url(#clip0_431_565)">
        <path d="M20.6648 10.805C20.6648 11.0786 20.6114 11.3495 20.5075 11.6023C20.4036 11.855 20.2514 12.0847 20.0594 12.2782C19.8675 12.4716 19.6396 12.6251 19.3888 12.7298C19.138 12.8345 18.8692 12.8884 18.5977 12.8884H13.3796C13.3469 12.8884 13.3148 12.8963 13.2857 12.9113C13.2567 12.9263 13.2316 12.948 13.2124 12.9747C13.1933 13.0013 13.1807 13.0322 13.1757 13.0647C13.1707 13.0972 13.1734 13.1304 13.1836 13.1617C13.6401 14.3277 13.7882 15.5931 13.6136 16.8342C13.1274 18.58 12.0971 19.0842 11.291 18.9717C10.895 18.9038 10.5371 18.693 10.2841 18.3786C10.0311 18.0643 9.90019 17.6678 9.91592 17.2634C9.91592 14.975 8.15558 12.475 6.58045 11.3792C6.52531 11.3408 6.48024 11.2895 6.44912 11.2297C6.41801 11.1699 6.40179 11.1034 6.40186 11.0359V2.60585C6.40183 2.50907 6.43525 2.41529 6.49635 2.34063C6.55746 2.26597 6.64244 2.21507 6.73673 2.19669C7.03191 2.13918 7.2998 2.08419 7.55282 2.03002C8.66541 1.76287 9.80576 1.63109 10.9495 1.63752H16.3239C17.9421 1.63752 18.1843 2.55419 18.1843 3.09585C18.1845 3.38316 18.1188 3.66663 17.9925 3.92419C18.4292 4.14717 18.761 4.5348 18.9158 5.00289C19.0706 5.47097 19.036 5.98171 18.8193 6.42418C19.1257 6.58107 19.3831 6.82035 19.5629 7.11554C19.7427 7.41073 19.8379 7.75031 19.838 8.09668C19.8385 8.40886 19.7609 8.71613 19.6123 8.99002C19.9316 9.17133 20.1974 9.43496 20.3824 9.7539C20.5673 10.0728 20.6648 10.4356 20.6648 10.805Z" fill="white"/>
        <path d="M5.16171 11.0133C5.16171 11.2344 5.0746 11.4463 4.91953 11.6026C4.76447 11.7589 4.55416 11.8467 4.33487 11.8467H1.64764C1.42835 11.8467 1.21804 11.7589 1.06298 11.6026C0.907914 11.4463 0.820801 11.2344 0.820801 11.0133L0.820801 1.84668C0.820801 1.62567 0.907914 1.4137 1.06298 1.25742C1.21804 1.10114 1.42835 1.01335 1.64764 1.01335H4.33487C4.55416 1.01335 4.76447 1.10114 4.91953 1.25742C5.0746 1.4137 5.16171 1.62567 5.16171 1.84668V11.0133ZM3.92145 3.30501C3.92145 3.1814 3.88508 3.06056 3.81694 2.95778C3.7488 2.855 3.65195 2.77489 3.53863 2.72759C3.42532 2.68028 3.30063 2.66791 3.18034 2.69202C3.06005 2.71614 2.94955 2.77566 2.86282 2.86307C2.7761 2.95048 2.71703 3.06184 2.69311 3.18308C2.66918 3.30432 2.68146 3.42999 2.72839 3.54419C2.77533 3.65839 2.85481 3.75601 2.95679 3.82468C3.05877 3.89336 3.17867 3.93001 3.30132 3.93001C3.46579 3.93001 3.62352 3.86417 3.73982 3.74695C3.85612 3.62974 3.92145 3.47077 3.92145 3.30501Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_431_565">
          <rect width="19.8442" height="20" fill="white" transform="matrix(1 0 0 -1 0.820801 20)"/>
        </clipPath>
      </defs>
    </svg>
    `;
  }

  //changing the icons next to the titles of Related and Recently Viewed Articles on the Article Page 
  const articleRelatives = document.querySelectorAll('.article-relatives li')
  articleRelatives.forEach(item =>{
    const svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"><path d="M13.3906 5.85938C12.6368 5.85938 12.0234 5.24605 12.0234 4.49219V0H5.03125C3.8466 0 2.88281 0.963789 2.88281 2.14844V17.8516C2.88281 19.0362 3.8466 20 5.03125 20H15.9688C17.1534 20 18.1172 19.0362 18.1172 17.8516V5.85938H13.3906ZM6.08594 14.0625H8.92656C9.25016 14.0625 9.5125 14.3248 9.5125 14.6484C9.5125 14.972 9.25016 15.2344 8.92656 15.2344H6.08594C5.76234 15.2344 5.5 14.972 5.5 14.6484C5.5 14.3248 5.76234 14.0625 6.08594 14.0625ZM5.5 11.5234C5.5 11.1998 5.76234 10.9375 6.08594 10.9375H14.6797C15.0033 10.9375 15.2656 11.1998 15.2656 11.5234C15.2656 11.847 15.0033 12.1094 14.6797 12.1094H6.08594C5.76234 12.1094 5.5 11.847 5.5 11.5234ZM14.6797 7.8125C15.0033 7.8125 15.2656 8.07484 15.2656 8.39844C15.2656 8.72203 15.0033 8.98438 14.6797 8.98438H6.08594C5.76234 8.98438 5.5 8.72203 5.5 8.39844C5.5 8.07484 5.76234 7.8125 6.08594 7.8125H14.6797Z" fill="#111111"/><path d="M13.1953 4.49216C13.1953 4.59986 13.2829 4.68747 13.3906 4.68747H17.856C17.7488 4.48958 17.6109 4.30782 17.4453 4.15107L13.6788 0.587707C13.5326 0.449426 13.3698 0.334075 13.1954 0.242981V4.49216H13.1953Z" fill="#111111"/></svg>';
    const parser = new DOMParser();
    let svgElement = parser.parseFromString(svgString, 'image/svg+xml').querySelector('svg');
    item.insertBefore(svgElement, item.firstChild);
  })

  //Adding target="_blank" for social media sharing and replacing the Twitter icon
  const shareLinks = document.querySelectorAll('.share a')
  shareLinks.forEach(item => {
    item.target = '_blank'
  })
  const shareTwitter = document.querySelector('.share-twitter');
  if(shareTwitter){
    shareTwitter.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
    </svg>
    `
  }

  //Video, Extrat a video link from the image attribute
  let videoThumbnails = document.querySelectorAll('.videos__item');

  if (videoThumbnails) {
    videoThumbnails.forEach(function (thumbnail) {
      let thumbnailImage = thumbnail.querySelector('.videos__img');
      let thumbnailHeading = thumbnail.querySelector('h4');

      thumbnailImage.addEventListener('click', openModal);
      thumbnailHeading.addEventListener('click', openModal);

      function openModal() {
        let videoSrc = thumbnail.querySelector('img').getAttribute('data-video-src');
        let videoModal = document.querySelector('.video-modal');
        let iframe = videoModal.querySelector('iframe');
        iframe.setAttribute('src', videoSrc);
        videoModal.style.display = 'flex';
      }
    });
  }

  //Video, opening Modal Window on click on Play Button
  let videoModal = document.querySelector('.video-modal');
  if(videoModal){
    videoModal.addEventListener('click', function(event) {
      if (event.target === videoModal) {
        var iframe = videoModal.querySelector('iframe');

        iframe.setAttribute('src', '');
        videoModal.style.display = 'none';
      }
    });
  }

  //Video, closing Modal Window
  let closeButton = document.querySelector('.close');
  if(closeButton){
    closeButton.addEventListener('click', function() {
      let videoModal = document.querySelector('.video-modal');
      let iframe = videoModal.querySelector('iframe');

      iframe.setAttribute('src', '');
      videoModal.style.display = 'none';
    });
  }

  //switching FAQ items
  const descriptionItems = document.querySelectorAll('.faq__item');
  if(descriptionItems){
    descriptionItems.forEach((item) => {
      item.addEventListener('click', function() {
        descriptionItems.forEach(descItem => {
          if (descItem !== item) {
              descItem.classList.remove('open');
          }
        });
        this.classList.toggle('open')
      })
    })
  }

  //Page animation (fade-in-up)
  function animateElements() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
  
    animatedElements.forEach(function (element) {
      let position = element.getBoundingClientRect().top;
  
      if (position < window.innerHeight) {
        element.classList.add('done');
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', animateElements);
  window.addEventListener('scroll', animateElements);


  //DEFAULT THEME CODE

  // Key map
  const ENTER = 13;
  const ESCAPE = 27;

  function toggleNavigation(toggle, menu) {
    const isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
    toggle.setAttribute("aria-expanded", !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute("aria-expanded", false);
    toggle.setAttribute("aria-expanded", false);
    toggle.focus();
  }

  // Navigation

  window.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".header .menu-button-mobile");
    const menuList = document.querySelector("#user-nav-mobile");

    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleNavigation(menuButton, menuList);
    });

    menuList.addEventListener("keyup", (event) => {
      if (event.keyCode === ESCAPE) {
        event.stopPropagation();
        closeNavigation(menuButton, menuList);
      }
    });

    // Toggles expanded aria to collapsible elements
    const collapsible = document.querySelectorAll(
      ".collapsible-nav, .collapsible-sidebar"
    );

    collapsible.forEach((element) => {
      const toggle = element.querySelector(
        ".collapsible-nav-toggle, .collapsible-sidebar-toggle"
      );

      element.addEventListener("click", () => {
        toggleNavigation(toggle, element);
      });

      element.addEventListener("keyup", (event) => {
        console.log("escape");
        if (event.keyCode === ESCAPE) {
          closeNavigation(toggle, element);
        }
      });
    });

    // If multibrand search has more than 5 help centers or categories collapse the list
    const multibrandFilterLists = document.querySelectorAll(
      ".multibrand-filter-list"
    );
    multibrandFilterLists.forEach((filter) => {
      if (filter.children.length > 6) {
        // Display the show more button
        const trigger = filter.querySelector(".see-all-filters");
        trigger.setAttribute("aria-hidden", false);

        // Add event handler for click
        trigger.addEventListener("click", (event) => {
          event.stopPropagation();
          trigger.parentNode.removeChild(trigger);
          filter.classList.remove("multibrand-filter-list--collapsed");
        });
      }
    });
  });

  const isPrintableChar = (str) => {
    return str.length === 1 && str.match(/^\S$/);
  };

  function Dropdown(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;

    this.menuPlacement = {
      top: menu.classList.contains("dropdown-menu-top"),
      end: menu.classList.contains("dropdown-menu-end"),
    };

    this.toggle.addEventListener("click", this.clickHandler.bind(this));
    this.toggle.addEventListener("keydown", this.toggleKeyHandler.bind(this));
    this.menu.addEventListener("keydown", this.menuKeyHandler.bind(this));
    document.body.addEventListener("click", this.outsideClickHandler.bind(this));

    const toggleId = this.toggle.getAttribute("id") || crypto.randomUUID();
    const menuId = this.menu.getAttribute("id") || crypto.randomUUID();

    this.toggle.setAttribute("id", toggleId);
    this.menu.setAttribute("id", menuId);

    this.toggle.setAttribute("aria-controls", menuId);
    this.menu.setAttribute("aria-labelledby", toggleId);

    this.menu.setAttribute("tabindex", -1);
    this.menuItems.forEach((menuItem) => {
      menuItem.tabIndex = -1;
    });

    this.focusedIndex = -1;
  }

  Dropdown.prototype = {
    get isExpanded() {
      return this.toggle.getAttribute("aria-expanded") === "true";
    },

    get menuItems() {
      return Array.prototype.slice.call(
        this.menu.querySelectorAll("[role='menuitem'], [role='menuitemradio']")
      );
    },

    dismiss: function () {
      if (!this.isExpanded) return;

      this.toggle.removeAttribute("aria-expanded");
      this.menu.classList.remove("dropdown-menu-end", "dropdown-menu-top");
      this.focusedIndex = -1;
    },

    open: function () {
      if (this.isExpanded) return;

      this.toggle.setAttribute("aria-expanded", true);
      this.handleOverflow();
    },

    handleOverflow: function () {
      var rect = this.menu.getBoundingClientRect();

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight,
      };

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add("dropdown-menu-end");
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add("dropdown-menu-top");
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove("dropdown-menu-top");
      }
    },

    focusByIndex: function (index) {
      if (!this.menuItems.length) return;

      this.menuItems.forEach((item, itemIndex) => {
        if (itemIndex === index) {
          item.tabIndex = 0;
          item.focus();
        } else {
          item.tabIndex = -1;
        }
      });

      this.focusedIndex = index;
    },

    focusFirstMenuItem: function () {
      this.focusByIndex(0);
    },

    focusLastMenuItem: function () {
      this.focusByIndex(this.menuItems.length - 1);
    },

    focusNextMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      const currentIndex = this.menuItems.indexOf(currentItem);
      const nextIndex = (currentIndex + 1) % this.menuItems.length;

      this.focusByIndex(nextIndex);
    },

    focusPreviousMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      const currentIndex = this.menuItems.indexOf(currentItem);
      const previousIndex =
        currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

      this.focusByIndex(previousIndex);
    },

    focusByChar: function (currentItem, char) {
      char = char.toLowerCase();

      const itemChars = this.menuItems.map((menuItem) =>
        menuItem.textContent.trim()[0].toLowerCase()
      );

      const startIndex =
        (this.menuItems.indexOf(currentItem) + 1) % this.menuItems.length;

      // look up starting from current index
      let index = itemChars.indexOf(char, startIndex);

      // if not found, start from start
      if (index === -1) {
        index = itemChars.indexOf(char, 0);
      }

      if (index > -1) {
        this.focusByIndex(index);
      }
    },

    outsideClickHandler: function (e) {
      if (
        this.isExpanded &&
        !this.toggle.contains(e.target) &&
        !e.composedPath().includes(this.menu)
      ) {
        this.dismiss();
        this.toggle.focus();
      }
    },

    clickHandler: function (event) {
      event.stopPropagation();
      event.preventDefault();

      if (this.isExpanded) {
        this.dismiss();
        this.toggle.focus();
      } else {
        this.open();
        this.focusFirstMenuItem();
      }
    },

    toggleKeyHandler: function (e) {
      const key = e.key;

      switch (key) {
        case "Enter":
        case " ":
        case "ArrowDown":
        case "Down": {
          e.stopPropagation();
          e.preventDefault();

          this.open();
          this.focusFirstMenuItem();
          break;
        }
        case "ArrowUp":
        case "Up": {
          e.stopPropagation();
          e.preventDefault();

          this.open();
          this.focusLastMenuItem();
          break;
        }
        case "Esc":
        case "Escape": {
          e.stopPropagation();
          e.preventDefault();

          this.dismiss();
          this.toggle.focus();
          break;
        }
      }
    },

    menuKeyHandler: function (e) {
      const key = e.key;
      const currentElement = this.menuItems[this.focusedIndex];

      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      switch (key) {
        case "Esc":
        case "Escape": {
          e.stopPropagation();
          e.preventDefault();

          this.dismiss();
          this.toggle.focus();
          break;
        }
        case "ArrowDown":
        case "Down": {
          e.stopPropagation();
          e.preventDefault();

          this.focusNextMenuItem(currentElement);
          break;
        }
        case "ArrowUp":
        case "Up": {
          e.stopPropagation();
          e.preventDefault();
          this.focusPreviousMenuItem(currentElement);
          break;
        }
        case "Home":
        case "PageUp": {
          e.stopPropagation();
          e.preventDefault();
          this.focusFirstMenuItem();
          break;
        }
        case "End":
        case "PageDown": {
          e.stopPropagation();
          e.preventDefault();
          this.focusLastMenuItem();
          break;
        }
        case "Tab": {
          if (e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            this.dismiss();
            this.toggle.focus();
          } else {
            this.dismiss();
          }
          break;
        }
        default: {
          if (isPrintableChar(key)) {
            e.stopPropagation();
            e.preventDefault();
            this.focusByChar(currentElement, key);
          }
        }
      }
    },
  };

  // Drodowns

  window.addEventListener("DOMContentLoaded", () => {
    const dropdowns = [];
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    dropdownToggles.forEach((toggle) => {
      const menu = toggle.nextElementSibling;
      if (menu && menu.classList.contains("dropdown-menu")) {
        dropdowns.push(new Dropdown(toggle, menu));
      }
    });
  });

  // Share

  window.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".share a");
    links.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        window.open(anchor.href, "", "height = 500, width = 500");
      });
    });
  });

  // Vanilla JS debounce function, by Josh W. Comeau:
  // https://www.joshwcomeau.com/snippets/javascript/debounce/
  function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  // Define variables for search field
  let searchFormFilledClassName = "search-has-value";
  let searchFormSelector = "form[role='search']";

  // Clear the search input, and then return focus to it
  function clearSearchInput(event) {
    event.target
      .closest(searchFormSelector)
      .classList.remove(searchFormFilledClassName);

    let input;
    if (event.target.tagName === "INPUT") {
      input = event.target;
    } else if (event.target.tagName === "BUTTON") {
      input = event.target.previousElementSibling;
    } else {
      input = event.target.closest("button").previousElementSibling;
    }
    input.value = "";
    input.focus();
  }

  // Have the search input and clear button respond
  // when someone presses the escape key, per:
  // https://twitter.com/adambsilver/status/1152452833234554880
  function clearSearchInputOnKeypress(event) {
    const searchInputDeleteKeys = ["Delete", "Escape"];
    if (searchInputDeleteKeys.includes(event.key)) {
      clearSearchInput(event);
    }
  }

  // Create an HTML button that all users -- especially keyboard users --
  // can interact with, to clear the search input.
  // To learn more about this, see:
  // https://adrianroselli.com/2019/07/ignore-typesearch.html#Delete
  // https://www.scottohara.me/blog/2022/02/19/custom-clear-buttons.html
  function buildClearSearchButton(inputId) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("aria-controls", inputId);
    button.classList.add("clear-button");
    const buttonLabel = window.searchClearButtonLabelLocalized;
    const icon = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' role='img' viewBox='0 0 12 12' aria-label='${buttonLabel}'><path stroke='currentColor' stroke-linecap='round' stroke-width='2' d='M3 9l6-6m0 6L3 3'/></svg>`;
    button.innerHTML = icon;
    button.addEventListener("click", clearSearchInput);
    button.addEventListener("keyup", clearSearchInputOnKeypress);
    return button;
  }

  // Append the clear button to the search form
  function appendClearSearchButton(input, form) {
    const searchClearButton = buildClearSearchButton(input.id);
    form.append(searchClearButton);
    if (input.value.length > 0) {
      form.classList.add(searchFormFilledClassName);
    }
  }

  // Add a class to the search form when the input has a value;
  // Remove that class from the search form when the input doesn't have a value.
  // Do this on a delay, rather than on every keystroke.
  const toggleClearSearchButtonAvailability = debounce((event) => {
    const form = event.target.closest(searchFormSelector);
    form.classList.toggle(
      searchFormFilledClassName,
      event.target.value.length > 0
    );
  }, 200);

  // Search

  window.addEventListener("DOMContentLoaded", () => {
    // Set up clear functionality for the search field
    const searchForms = [...document.querySelectorAll(searchFormSelector)];
    const searchInputs = searchForms.map((form) =>
      form.querySelector("input[type='search']")
    );
    searchInputs.forEach((input) => {
      appendClearSearchButton(input, input.closest(searchFormSelector));
      input.addEventListener("keyup", clearSearchInputOnKeypress);
      input.addEventListener("keyup", toggleClearSearchButtonAvailability);
    });
  });

  const key = "returnFocusTo";

  function saveFocus() {
    const activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem(key, "#" + activeElementId);
  }

  function returnFocus() {
    const returnFocusTo = sessionStorage.getItem(key);
    if (returnFocusTo) {
      sessionStorage.removeItem("returnFocusTo");
      const returnFocusToEl = document.querySelector(returnFocusTo);
      returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }
  }

  // Forms

  window.addEventListener("DOMContentLoaded", () => {
    // In some cases we should preserve focus after page reload
    returnFocus();

    // show form controls when the textarea receives focus or back button is used and value exists
    const commentContainerTextarea = document.querySelector(
      ".comment-container textarea"
    );
    const commentContainerFormControls = document.querySelector(
      ".comment-form-controls, .comment-ccs"
    );

    if (commentContainerTextarea) {
      commentContainerTextarea.addEventListener(
        "focus",
        function focusCommentContainerTextarea() {
          commentContainerFormControls.style.display = "block";
          commentContainerTextarea.removeEventListener(
            "focus",
            focusCommentContainerTextarea
          );
        }
      );

      if (commentContainerTextarea.value !== "") {
        commentContainerFormControls.style.display = "block";
      }
    }

    // Expand Request comment form when Add to conversation is clicked
    const showRequestCommentContainerTrigger = document.querySelector(
      ".request-container .comment-container .comment-show-container"
    );
    const requestCommentFields = document.querySelectorAll(
      ".request-container .comment-container .comment-fields"
    );
    const requestCommentSubmit = document.querySelector(
      ".request-container .comment-container .request-submit-comment"
    );

    if (showRequestCommentContainerTrigger) {
      showRequestCommentContainerTrigger.addEventListener("click", () => {
        showRequestCommentContainerTrigger.style.display = "none";
        Array.prototype.forEach.call(requestCommentFields, (element) => {
          element.style.display = "block";
        });
        requestCommentSubmit.style.display = "inline-block";

        if (commentContainerTextarea) {
          commentContainerTextarea.focus();
        }
      });
    }

    // Mark as solved button
    const requestMarkAsSolvedButton = document.querySelector(
      ".request-container .mark-as-solved:not([data-disabled])"
    );
    const requestMarkAsSolvedCheckbox = document.querySelector(
      ".request-container .comment-container input[type=checkbox]"
    );
    const requestCommentSubmitButton = document.querySelector(
      ".request-container .comment-container input[type=submit]"
    );

    if (requestMarkAsSolvedButton) {
      requestMarkAsSolvedButton.addEventListener("click", () => {
        requestMarkAsSolvedCheckbox.setAttribute("checked", true);
        requestCommentSubmitButton.disabled = true;
        requestMarkAsSolvedButton.setAttribute("data-disabled", true);
        requestMarkAsSolvedButton.form.submit();
      });
    }

    // Change Mark as solved text according to whether comment is filled
    const requestCommentTextarea = document.querySelector(
      ".request-container .comment-container textarea"
    );

    const usesWysiwyg =
      requestCommentTextarea &&
      requestCommentTextarea.dataset.helper === "wysiwyg";

    function isEmptyPlaintext(s) {
      return s.trim() === "";
    }

    function isEmptyHtml(xml) {
      const doc = new DOMParser().parseFromString(`<_>${xml}</_>`, "text/xml");
      const img = doc.querySelector("img");
      return img === null && isEmptyPlaintext(doc.children[0].textContent);
    }

    const isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

    if (requestCommentTextarea) {
      requestCommentTextarea.addEventListener("input", () => {
        if (isEmpty(requestCommentTextarea.value)) {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText =
              requestMarkAsSolvedButton.getAttribute("data-solve-translation");
          }
        } else {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText =
              requestMarkAsSolvedButton.getAttribute(
                "data-solve-and-submit-translation"
              );
          }
        }
      });
    }

    const selects = document.querySelectorAll(
      "#request-status-select, #request-organization-select"
    );

    selects.forEach((element) => {
      element.addEventListener("change", (event) => {
        event.stopPropagation();
        saveFocus();
        element.form.submit();
      });
    });

    // Submit requests filter form on search in the request list page
    const quickSearch = document.querySelector("#quick-search");
    if (quickSearch) {
      quickSearch.addEventListener("keyup", (event) => {
        if (event.keyCode === ENTER) {
          event.stopPropagation();
          saveFocus();
          quickSearch.form.submit();
        }
      });
    }

    // Submit organization form in the request page
    const requestOrganisationSelect = document.querySelector(
      "#request-organization select"
    );

    if (requestOrganisationSelect) {
      requestOrganisationSelect.addEventListener("change", () => {
        requestOrganisationSelect.form.submit();
      });

      requestOrganisationSelect.addEventListener("click", (e) => {
        // Prevents Ticket details collapsible-sidebar to close on mobile
        e.stopPropagation();
      });
    }

    // If there are any error notifications below an input field, focus that field
    const notificationElm = document.querySelector(".notification-error");
    if (
      notificationElm &&
      notificationElm.previousElementSibling &&
      typeof notificationElm.previousElementSibling.focus === "function"
    ) {
      notificationElm.previousElementSibling.focus();
    }
  });

})();
