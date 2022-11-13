// Dom7
var $ = Dom7;

// Theme
var theme = 'ios';
// Import Cordova APIs
// import cordovaApp from './cordova-app.js';
// const cordovaApp = require('./cordova-app.js');
// Init App
var app = new Framework7({
  id: 'io.framework7.capsulepluse',
  el: '#app',
  theme,
  cache: false,
  // store.js,
  store: store,
  // routes.js,
  routes: routes,
  remoteUrl: "https://capsul.test/api/",
  // remoteUrl: "https://capsuleplus.in/api/",
  // remoteUrl: "https://192.168.113.237/capsul/admin_working/public/api/",
  //=== global ajax call for authentication ===
  cartCount: function () {
    app.params.authHeader();
    app.request.postJSON(app.params.remoteUrl + 'cart-count')
      .then(function (response) {
        console.log('countdata', response);
        return response.data.cartCount;
      });
  },
  callToServer: function (sUrl, postdata, successCallBack) {
    let url = app.params.remoteUrl + sUrl;
    let data = postdata;
    console.log("url", url);
    app.params.authHeader();
    if (data == "") {
      app.request.json(url, data,
        function (res, status) {
          console.log("Response : ", res);
          if (status) {
            successCallBack(res);
          }

        },
        function (err, status) {
          app.preloader.hide();
          console.log("error", err.response);
          console.log(status);

          switch (status) {
            case 500:
              app.params.showToastBottom("Not able to connect with server, Contact to support!!");
              break;
            case 401:
              app.params.logOut();
              break;
            default:
              app.params.showToastBottom("Request fail !! Please try after some time!!");
          }
        });
    } else {
      app.request.postJSON(url, data,
        function (res, status) {
          console.log("Response : ", res);
          if (status) {
            successCallBack(res);
          }

        },
        function (err, status) {
          app.preloader.hide();
          console.log("error", err.response);
          console.log(status);

          switch (status) {
            case 500:
              app.params.showToastBottom("Not able to connect with server, Contact with support!!");
              break;
            case 401:
              app.params.logOut();
              break;
            default:
              app.params.showToastBottom("Request fail !! Please try after some time!!");
          }
        });
    }



  },
  authHeader: function () {
    Framework7.request.setup({
      // beforeSend: function (xhr) {
      //     // xhr.setRequestHeader ('Authorization', 'Token '+ app.methods.localstoreout('token').access);
      //     xhr.setRequestHeader ('Authorization', 'Token ');
      // }
      headers: {
        // 'Authorization', 'Token '+ app.methods.localstoreout('token').access
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'Accept': 'application/json'
      }
    });
  },
  uuid: function () {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  loginSuccess: function (data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("mobile", data.mobile);
    localStorage.setItem("name", data.name);
    app.params.userName = data.name;
    localStorage.setItem("is_login", 1);
  },
  logOut: function () {
    //============= remove from local storage =========
    localStorage.setItem("token", "");
    localStorage.setItem("mobile", "");
    localStorage.setItem("name", "");
    localStorage.setItem("is_login", "");
    app.views.main.router.navigate('/login/', {
      ignoreCache: true,
      reloadCurrent: true,
    });
    app.views.main.router.clearPreviousHistory();
    let toastBottom = app.toast.create({
      text: "You’ve been Logged out!",
      closeTimeout: 2000,
    });
    toastBottom.open();
  },
  markInputAsError: function (componentEl, inputName, message) {
    var self = this;
    var el = componentEl.find('input[name="' + inputName + '"]');
    el.addClass('input-invalid');
    el.parent().parent().parent().addClass('item-input-with-error-message item-input-invalid');
    if (!el.next('.item-input-error-message').length) {
      $('<div class="item-input-error-message">' + message + '</div>').insertAfter(el);
    } else {
      el.next('.item-input-error-message').html(message);
    }
  },
  popup: {
    closeOnEscape: true,
  },
  sheet: {
    closeOnEscape: true,
  },
  popover: {
    closeOnEscape: true,
  },
  actions: {
    closeOnEscape: true,
  },
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
  statusbar: {
    iosOverlaysWebView: true,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        app.statusbar.show();
        app.statusbar.setTextColor("black");
        app.statusbar.setBackgroundColor("#547845")
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);

      }
    },
  },
  //============== shoping ================
  totalCartItems: function () {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let total;
    if (cart == null || cart == '') {
      total = 0;
    } else {
      total = cart.length;
    }
    return total;
  },
  currentProductDetails: {
    price: "",
    image: "",
    mrp: 0,
    name: "",
    pid: "",
    quantity: 0,
    type: 'product',
  },
  //======== add active product =======
  setActiveProduct: function (productDetails) {
    let currentProduct = {
      price: productDetails.price,
      image: productDetails.image,
      mrp: productDetails.mrp,
      name: productDetails.name,
      pid: productDetails.pid,
      quantity: 1,
      type: productDetails.type,
    }
    app.params.currentProductDetails = currentProduct;
  },
  getActiveProduct: function () {
    return app.params.currentProductDetails;
  },
  //======== add to cart active product ======
  addToCartCurrentProduct: function () {
    let currentProduct = app.params.getActiveProduct();
    app.preloader.show();
    app.params.callToServer("add-cart", currentProduct,
      function success(Responce) {
        app.preloader.hide();
        let cartCount = Responce.data.cartCount;
        localStorage.setItem("cartCount", cartCount);
        // categoryName = Responce.data.category;
        //$update();
        app.popup.close('.addproduct');
      });

  },
  showToastBottom: (msg = "") => {
    // Create toast
    let toastBottom = app.toast.create({
      text: msg,
      closeTimeout: 2000,
    });

    toastBottom.open();
  },



});


$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized for all pages

  /* update user name and user pic */
  $('#logedUserName').text(localStorage.getItem("name"));
  $('#logeduserPin').text(localStorage.getItem("mobile"));


  /* coverimg */
  $('.coverimg').each(function () {
    var imgpath = $(this).find('img');
    $(this).css('background-image', 'url(' + imgpath.attr('src') + ')');
    imgpath.hide();
  });

  $('.accordion-toggle').on('click', function () {
    $(this).toggleClass('active')
    $(this).closest('.accordion-list').find('.accordion-content').toggleClass('show')
  })
});

$(document).on('page:init', '.page[data-name="splash"]', function (e) {
  setTimeout(function () {
    //============ user login or not ==========
    var is_login = localStorage.getItem("is_login");
    if (is_login == null || is_login == '') {
      localStorage.setItem("is_login", "");
      app.views.main.router.navigate('/landing/');
    } else {
      app.views.main.router.navigate('/home/');
    }
  }, 3000);
})
$(document).on('page:init', '.page[data-name="thankyouorder"]', function (e) {
  setTimeout(function () {
    app.views.main.router.navigate('/home/');
  }, 3000);
})
$(document).on('page:init', '.page[data-name="landing"]', function (e) {
  var swiper1 = app.swiper.create(".swiper-intro", {
    slidesPerView: "auto",
    spaceBetween: 15,
    pagination: {
      el: '.pagination-intro'
    }
  });
});
$(document).on('page:init', '.page[data-name="verify_"]', function (e) {


  document.getElementById('timer').innerHTML = '00' + ':' + '30';
  startTimer();

  function startTimer() {
    var presentTime = document.getElementById('timer').innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));
    if (s == 59) {
      m = m - 1
    }
    if (m < 0) {

      return
    }

    document.getElementById('timer').innerHTML =
      m + ":" + s;
    setTimeout(startTimer, 1000);
  }

  function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {
      sec = "0" + sec
    }; // add zero in front of numbers < 10
    if (sec < 0) {
      sec = "59"
    };
    return sec;
  }





});


/* pwa app install */
var deferredPrompt;
window.addEventListener('beforeinstallprompt', function (e) {
  console.log('beforeinstallprompt Event fired');
  e.preventDefault();
  deferredPrompt = e;
  return false;
});



$(document).on('page:init', '.page[data-name="home"]', function (e) {

  /* pwa app install */
  $('#addtohome').on('click', function () {
    if (deferredPrompt !== undefined) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choiceResult) {

        if (choiceResult.outcome == 'dismissed') {
          console.log('User cancelled home screen install');
        } else {
          console.log('User added to home screen');
        }
        deferredPrompt = null;
      });
    }
  });

  /* filter sliders range picker for filter */
  // var html5Slider = document.getElementById('rangeslider');
  // noUiSlider.create(html5Slider, {
  //   start: [100, 200],
  //   connect: true,
  //   range: {
  //     'min': 0,
  //     'max': 500
  //   }
  // });

  // var inputNumber = document.getElementById('input-number');
  // var select = document.getElementById('input-select');

  // html5Slider.noUiSlider.on('update', function (values, handle) {
  //   var value = values[handle];

  //   if (handle) {
  //     inputNumber.value = value;
  //   } else {
  //     select.value = Math.round(value);
  //   }
  // });

  // select.addEventListener('change', function () {
  //   html5Slider.noUiSlider.set([this.value, null]);
  // });
  // inputNumber.addEventListener('change', function () {
  //   html5Slider.noUiSlider.set([null, this.value]);
  // });

  /* carousel */
  // var swiper1 = new Swiper(".categoriesswiper", {
  //   slidesPerView: "auto",
  //   spaceBetween: 12,
  // });

  // var swiper2 = new Swiper(".offerslides", {
  //   slidesPerView: "1",
  //   spaceBetween: 10,
  //   pagination: {
  //     el: ".pagination-offerslides",
  //   },
  //   breakpoints: {
  //     640: {
  //       slidesPerView: 1,
  //     },
  //     768: {
  //       slidesPerView: 2,
  //       spaceBetween: 20,
  //     },
  //     1024: {
  //       slidesPerView: 3,
  //       spaceBetween: 30,
  //     },
  //   },
  // });

  // var swiper3 = new Swiper(".trendingslides", {
  //   slidesPerView: "auto",
  //   spaceBetween: 26,
  // });

  // var swiper4 = new Swiper(".shopslides", {
  //   slidesPerView: "auto",
  //   spaceBetween: 0,
  // });


})

$(document).on('page:init', '.page[data-name="stats_"]', function (e) {

  var swiper2 = new Swiper(".offerslides", {
    slidesPerView: "1",
    spaceBetween: 10,
    pagination: {
      el: ".pagination-offerslides",
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

  var swiper4 = new Swiper(".shopslides", {
    slidesPerView: "auto",
    spaceBetween: 0,
  });

  // // Range Picker
  // calendarRange = app.calendar.create({
  //   inputEl: '#daterange',
  //   rangePicker: true
  // });

  // $('.daterange-btn').on('click', function () {
  //   $('#daterange').click();
  // });

  // /* chart js areachart */
  // window.randomScalingFactor = function () {
  //   return Math.round(Math.random() * 50);
  // }
  // var areachart = document.getElementById('areachart').getContext('2d');
  // var gradient = areachart.createLinearGradient(0, 0, 0, 200);
  // gradient.addColorStop(0, '#FF1C52');
  // gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  // var myareachartCofig = {
  //   type: 'line',
  //   data: {
  //     labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
  //     datasets: [{
  //       label: '# of Votes',
  //       data: [
  //         randomScalingFactor(),
  //         randomScalingFactor(),
  //         randomScalingFactor(),
  //         randomScalingFactor(),
  //         randomScalingFactor(),
  //         randomScalingFactor(),
  //         randomScalingFactor(),
  //         randomScalingFactor(),
  //       ],
  //       backgroundColor: gradient,
  //       borderColor: '#FF1C52',
  //       borderWidth: 1,
  //       fill: true,
  //       tension: 0.4,
  //     }]
  //   },
  //   options: {
  //     plugins: {
  //       legend: {
  //         display: false,
  //       },
  //     },
  //     scales: {
  //       y: {
  //         display: false,
  //         beginAtZero: true
  //       },
  //       x: {
  //         color: '#666666',
  //       }
  //     }
  //   }
  // }
  // var myAreaChart = new Chart(areachart, myareachartCofig);

  // /* my area chart randomize */
  // setInterval(function () {
  //   myareachartCofig.data.datasets.forEach(function (dataset) {
  //     dataset.data = dataset.data.map(function () {
  //       return randomScalingFactor();
  //     });
  //   });
  //   myAreaChart.update();
  // }, 2000);


  /* Progress circle  */
  // var progressCircles = new ProgressBar.Circle(progressCircle1, {
  //   color: '#52E5A5',
  //   // This has to be the same size as the maximum width to
  //   // prevent clipping
  //   strokeWidth: 10,
  //   trailWidth: 10,
  //   easing: 'easeInOut',
  //   trailColor: 'rgba(0, 0, 0, 0.08)',
  //   duration: 1400,
  //   text: {
  //     autoStyleContainer: false
  //   },
  //   from: { color: '#52E5A5', width: 10 },
  //   to: { color: '#52E5A5', width: 10 },
  //   // Set default step function for all animate calls
  //   step: function (state, circle) {
  //     circle.path.setAttribute('stroke', state.color);
  //     circle.path.setAttribute('stroke-width', state.width);

  //     var value = Math.round(circle.value() * 100);
  //     if (value === 0) {
  //       circle.setText('');
  //     } else {
  //       circle.setText(value);
  //     }

  //   }
  // });

  // progressCircles.text.style.fontSize = '12px';
  // progressCircles.animate(0.65);  // Number from 0.0 to 1.0

  // var progressCircles3 = new ProgressBar.Circle(progressCircle3, {
  //   color: '#FFC400',
  //   // This has to be the same size as the maximum width to
  //   // prevent clipping
  //   strokeWidth: 10,
  //   trailWidth: 10,
  //   easing: 'easeInOut',
  //   trailColor: 'rgba(0, 0, 0, 0.08)',
  //   duration: 1400,
  //   text: {
  //     autoStyleContainer: false
  //   },
  //   from: { color: '#FFC400', width: 10 },
  //   to: { color: '#FFC400', width: 10 },
  //   // Set default step function for all animate calls
  //   step: function (state, circle) {
  //     circle.path.setAttribute('stroke', state.color);
  //     circle.path.setAttribute('stroke-width', state.width);

  //     var value = Math.round(circle.value() * 100);
  //     if (value === 0) {
  //       circle.setText('');
  //     } else {
  //       circle.setText(value);
  //     }

  //   }
  // });
  // progressCircles3.text.style.fontSize = '12px';
  // progressCircles3.animate(0.60);  // Number from 0.0 to 1.0

  // var progressCircles2 = new ProgressBar.Circle(progressCircle2, {
  //   color: '#FF1C52',
  //   // This has to be the same size as the maximum width to
  //   // prevent clipping
  //   strokeWidth: 10,
  //   trailWidth: 10,
  //   easing: 'easeInOut',
  //   trailColor: 'rgba(0, 0, 0, 0.08)',
  //   duration: 1400,
  //   text: {
  //     autoStyleContainer: false
  //   },
  //   from: { color: '#FF1C52', width: 10 },
  //   to: { color: '#FF1C52', width: 10 },
  //   // Set default step function for all animate calls
  //   step: function (state, circle) {
  //     circle.path.setAttribute('stroke', state.color);
  //     circle.path.setAttribute('stroke-width', state.width);

  //     var value = Math.round(circle.value() * 100);
  //     if (value === 0) {
  //       circle.setText('');
  //     } else {
  //       circle.setText(value);
  //     }

  //   }
  // });
  // progressCircles2.text.style.fontSize = '12px';
  // progressCircles2.animate(0.85);  // Number from 0.0 to 1.0


})


$(document).on('page:init', '.page[data-name="profile"]', function (e) {
  /* swiper carousel summary blocks */
  var swiper1 = app.swiper.create(".swipersummary", {
    slidesPerView: "auto",
    spaceBetween: 18,
    pagination: false
  });
})

$(document).on('page:init', '.page[data-name="shophome"]', function (e) {
  /* swiper carousel categories */
  var swiper1 = app.swiper.create(".swipercategory", {
    slidesPerView: "auto",
    spaceBetween: 0,
    pagination: false
  });

  /* swiper carousel projects */
  var swiper2 = app.swiper.create(".swipertrending", {
    slidesPerView: "auto",
    spaceBetween: 18,
    pagination: false
  });


})

$(document).on('page:init', '.page[data-name="product"]', function (e) {
  /* swiper carousel projects */
  var swiper5 = new Swiper(".imageswiper", {
    slidesPerView: "1",
    spaceBetween: 12,
    pagination: {
      el: ".imageswiper-pagination",
    },
  });
  var swiper6 = new Swiper(".shopslides", {
    slidesPerView: "auto",
    spaceBetween: 0,
  });

  var swiper7 = new Swiper(".offerslides", {
    slidesPerView: "1",
    spaceBetween: 10,
    pagination: {
      el: ".pagination-offerslides",
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

  var swiper8 = new Swiper(".trendingslides", {
    slidesPerView: "auto",
    spaceBetween: 26,
  });

})
//=========== logout function ==========
$(document).on('click', '.logout', function (e) {
  app.params.logOut();
  console.log(app);
})

$(document).on('click', '.counter-increase', function (e) {
  var countValue = parseInt($(this).parent().find(".counter-value").text());
  countValue = countValue + 1;
  $(this).parent().find(".counter-value").text(countValue);
  app.params.currentProductDetails.quantity = countValue;
  console.log(countValue);
});

$(document).on('click', '.counter-decrease', function (e) {
  var countValue = parseInt($(this).parent().find(".counter-value").text());

  if (countValue > 0) {
    countValue = countValue - 1;
  }
  $(this).parent().find(".counter-value").text(countValue);
  app.params.currentProductDetails.quantity = countValue;
  console.log(countValue);

});

/*
*All Cordova functioanity 
*/
var cordovaApp = {
  f7: null,
  /*
   This method hides splashscreen after 2 seconds
   */
  handleSplashscreen: function () {
    var f7 = cordovaApp.f7;
    if (!window.navigator.splashscreen || f7.device.electron)
      return;
    setTimeout(() => {
      window.navigator.splashscreen.hide();
    }, 2000);
  },


/*
     This method prevents back button tap to exit from app on android.
     And allows to exit app on backbutton double tap
     */
     handleAndroidBackButton: function () {
      var f7 = cordovaApp.f7;
      if (f7.device.electron)
          return;
      cordovaApp.backButtonTimestamp = new Date().getTime();
      document.addEventListener('backbutton', function (e) {
          if (f7.popup.get('.popup') == undefined && f7.dialog.get() == undefined) {
              f7.views.current.router.back();
          } else {
              if (f7.popup.get('.popup') != undefined) {
                  f7.popup.get('.popup').close();
              }
              if (f7.dialog.get() != undefined) {
                  f7.dialog.close();
              }
          }
          if (new Date().getTime() - cordovaApp.backButtonTimestamp < 550) {
              cordovaApp.backButtonTimestamp = new Date().getTime();
              if (window.navigator.app && window.navigator.app.exitApp) {
//                    window.navigator.app.exitApp();
                  navigator.app.exitApp();
              }
              return true;
          }
          cordovaApp.backButtonTimestamp = new Date().getTime();
          e.preventDefault();
          return false;
      }, false);
  },



  /*
   This method prevents back button tap to exit from app on android.
   In case there is an opened modal it will close that modal instead.
   In case there is a current view with navigation history, it will go back instead.
   */
  // handleAndroidBackButton: function () {

  //   console.log("back function");

  //   var f7 = cordovaApp.f7;
  //   const $ = f7.$;
  //   if (f7.device.electron)
  //     return;

  //   document.addEventListener('backbutton', function (e) {

  //     console.log("backbutton");

  //     if ($('.actions-modal.modal-in').length) {
  //       f7.actions.close('.actions-modal.modal-in');
  //       e.preventDefault();
  //       return false;
  //     }
  //     if ($('.dialog.modal-in').length) {
  //       f7.dialog.close('.dialog.modal-in');
  //       e.preventDefault();
  //       return false;
  //     }
  //     if ($('.sheet-modal.modal-in').length) {
  //       f7.sheet.close('.sheet-modal.modal-in');
  //       e.preventDefault();
  //       return false;
  //     }
  //     if ($('.popover.modal-in').length) {
  //       f7.popover.close('.popover.modal-in');
  //       e.preventDefault();
  //       return false;
  //     }
  //     if ($('.popup.modal-in').length) {
  //       if ($('.popup.modal-in>.view').length) {
  //         const currentView = f7.views.get('.popup.modal-in>.view');
  //         if (currentView && currentView.router && currentView.router.history.length > 1) {
  //           currentView.router.back();
  //           e.preventDefault();
  //           return false;
  //         }
  //       }
  //       f7.popup.close('.popup.modal-in');
  //       e.preventDefault();
  //       return false;
  //     }
  //     if ($('.login-screen.modal-in').length) {
  //       f7.loginScreen.close('.login-screen.modal-in');
  //       e.preventDefault();
  //       return false;
  //     }

  //     if ($('.page-current .searchbar-enabled').length) {
  //       f7.searchbar.disable('.page-current .searchbar-enabled');
  //       e.preventDefault();
  //       return false;
  //     }

  //     if ($('.page-current .card-expandable.card-opened').length) {
  //       f7.card.close('.page-current .card-expandable.card-opened');
  //       e.preventDefault();
  //       return false;
  //     }

  //     const currentView = f7.views.current;
  //     if (currentView && currentView.router && currentView.router.history.length > 1) {
  //       currentView.router.back();
  //       e.preventDefault();
  //       return false;
  //     }

  //     if ($('.panel.panel-in').length) {
  //       f7.panel.close('.panel.panel-in');
  //       e.preventDefault();
  //       return false;
  //     }
  //   }, false);
  // },
  /*
   This method does the following:
   - provides cross-platform view "shrinking" on keyboard open/close
   - hides keyboard accessory bar for all inputs except where it required
   */
  handleKeyboard: function () {
    var f7 = cordovaApp.f7;
    if (!window.Keyboard || !window.Keyboard.shrinkView || f7.device.electron)
      return;
    var $ = f7.$;
    window.Keyboard.shrinkView(false);
    window.Keyboard.disableScrollingInShrinkView(true);
    window.Keyboard.hideFormAccessoryBar(true);
    window.addEventListener('keyboardWillShow', () => {
      f7.input.scrollIntoView(document.activeElement, 0, true, true);
    });
    window.addEventListener('keyboardDidShow', () => {
      f7.input.scrollIntoView(document.activeElement, 0, true, true);
    });
    window.addEventListener('keyboardDidHide', () => {
      if (document.activeElement && $(document.activeElement).parents('.messagebar').length) {
        return;
      }
      window.Keyboard.hideFormAccessoryBar(false);
    });
    window.addEventListener('keyboardHeightWillChange', (event) => {
      var keyboardHeight = event.keyboardHeight;
      if (keyboardHeight > 0) {
        // Keyboard is going to be opened
        document.body.style.height = `calc(100% - ${keyboardHeight}px)`;
        $('html').addClass('device-with-keyboard');
      } else {
        // Keyboard is going to be closed
        document.body.style.height = '';
        $('html').removeClass('device-with-keyboard');
      }

    });
    $(document).on('touchstart', 'input, textarea, select', function (e) {
      var nodeName = e.target.nodeName.toLowerCase();
      var type = e.target.type;
      var showForTypes = ['datetime-local', 'time', 'date', 'datetime'];
      if (nodeName === 'select' || showForTypes.indexOf(type) >= 0) {
        window.Keyboard.hideFormAccessoryBar(false);
      } else {
        window.Keyboard.hideFormAccessoryBar(true);
      }
    }, true);
  },
  statusBar: function () {
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByHexString("#fff"); // => #333333
    StatusBar.styleDefault();
  },
  permission: function () {
    var permissions = cordova.plugins.permissions;
    permissions.checkPermission(permissions.CAMERA, function (status) {
      if (status.hasPermission) {
        console.log("Yes :D ");
      } else {
        permissions.requestPermission(permissions.CAMERA, function () {
          console.warn('Camera permission is not turned on');
        }, function (status) {
          if (!status.hasPermission)
            error();
          console.log("permision success");
        });

        console.warn("No :(  get ");
      }
    });
  },
  getPermission: function () {
    var permissions = cordova.plugins.permissions;
    var list = [
      permissions.CAMERA,
      permissions.READ_EXTERNAL_STORAGE,
      permissions.WRITE_EXTERNAL_STORAGE
    ];

    permissions.checkPermission(list, success, null);

    function error() {
      // app.dialog.alert('Permission not granted !!');
      console.log("Permission not granted !!");
    }

    function success(status) {
      if (!status.hasPermission) {

        permissions.requestPermissions(
          list,
          function (status) {
            if (!status.hasPermission)
              error();
          },
          error);
      }
    }


  },

  init: function (f7) {
    // Save f7 instance
    cordovaApp.f7 = f7;

    // Handle Android back button
    cordovaApp.handleAndroidBackButton();

    // Handle Splash Screen
    cordovaApp.handleSplashscreen();

    // Handle Keyboard
    cordovaApp.handleKeyboard();

    cordovaApp.statusBar();

    cordovaApp.getPermission();


  },
};



function getPermission() {
  var permissions = cordova.plugins.permissions;
  var list = [
    permissions.CAMERA,
    permissions.READ_EXTERNAL_STORAGE,
    permissions.WRITE_EXTERNAL_STORAGE
  ];

  permissions.hasPermission(list, success, null);

  function error() {
    app.dialog.alert('Permission not granted !!');
  }

  function success(status) {
    if (!status.hasPermission) {

      permissions.requestPermissions(
        list,
        function (status) {
          if (!status.hasPermission)
            error();
        },
        error);
    }
  }


};