// Dom7
var $ = Dom7;

// Theme
var theme = 'ios';

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
  // remoteUrl: "https://capsul.test/api/",
  remoteUrl: "https://192.168.113.237/capsul/admin_working/public/api/",
   //=== global ajax call for authentication ===
  cartCount: function(){
    app.params.authHeader();
    app.request.postJSON(app.params.remoteUrl +'cart-count') 
    .then(function (response) {
      console.log('countdata',response);
      return response.data.cartCount;
    });
  },
  callToServer:function(sUrl, postdata, successCallBack){
    let url =  app.params.remoteUrl + sUrl;
    let data = postdata;
                  console.log("url", url);
    app.params.authHeader();
    if(data == ""){
      app.request.json(url, data, 
        function(res,status){  
                console.log("Response : ", res);
            if(status){
              successCallBack(res);
            }
            
    }, function(err, status){
      app.preloader.hide();
            console.log("error",err.response);
            console.log(status);

            switch(status) {
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
    }else{
      app.request.postJSON(url, data, 
        function(res,status){  
                console.log("Response : ", res);
            if(status){
              successCallBack(res);
            }
            
    }, function(err, status){
      app.preloader.hide();
            console.log("error",err.response);
            console.log(status);

            switch(status) {
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
  authHeader: function(){
  Framework7.request.setup({
      // beforeSend: function (xhr) {
      //     // xhr.setRequestHeader ('Authorization', 'Token '+ app.methods.localstoreout('token').access);
      //     xhr.setRequestHeader ('Authorization', 'Token ');
      // }
      headers: {
        // 'Authorization', 'Token '+ app.methods.localstoreout('token').access
        'Authorization':'Bearer '+localStorage.getItem("token"),
        'Accept': 'application/json'
      }
    });
  },
  uuid: function () {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  },
  loginSuccess:function(data){
    localStorage.setItem("token",data.token);
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
  markInputAsError:function (componentEl, inputName, message) {
    var self = this;
    var el = componentEl.find('input[name="'+inputName+'"]');
    el.addClass('input-invalid');
    el.parent().parent().parent().addClass('item-input-with-error-message item-input-invalid');
    if (!el.next('.item-input-error-message').length) {
        self.$('<div class="item-input-error-message">'+message+'</div>').insertAfter(el);
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
  //============== shoping ================
  totalCartItems:function(){
    let cart =  JSON.parse(localStorage.getItem("cart"));
    let total ;
    if (cart == null || cart == ''){
      total = 0;
    }else{
      total = cart.length;
    }
    return total ;
  },
  currentProductDetails : {
    price: "",
    image: "",
    mrp: 0,
    name: "",
    pid: "",
    quantity:0
  } ,
  //======== add active product =======
  setActiveProduct:function(productDetails){
    let currentProduct = {
      price: productDetails.price,
      image: productDetails.image,
      mrp: productDetails.mrp,
      name: productDetails.name,
      pid: productDetails.pid,
      quantity:1
    }
    app.params.currentProductDetails = currentProduct ;
  },
  getActiveProduct:function(){
      return app.params.currentProductDetails ;
  },
  //======== add to cart active product ======
  addToCartCurrentProduct:function(){
    let currentProduct =  app.params.getActiveProduct();
    app.preloader.show();
    app.params.callToServer( "add-cart", currentProduct ,
    function success(Responce){
          app.preloader.hide();
          let cartCount = Responce.data.cartCount ;
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
      }else{
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
    if (s == 59) { m = m - 1 }
    if (m < 0) {
      
      return
    }

    document.getElementById('timer').innerHTML =
      m + ":" + s;
    setTimeout(startTimer, 1000);
  }

  function checkSecond(sec) {
    if (sec < 10 && sec >= 0) { sec = "0" + sec }; // add zero in front of numbers < 10
    if (sec < 0) { sec = "59" };
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
        }
        else {
          console.log('User added to home screen');
        }
        deferredPrompt = null;
      });
    }
  });

  /* filter sliders range picker for filter */
  var html5Slider = document.getElementById('rangeslider');
  noUiSlider.create(html5Slider, {
    start: [100, 200],
    connect: true,
    range: {
      'min': 0,
      'max': 500
    }
  });

  var inputNumber = document.getElementById('input-number');
  var select = document.getElementById('input-select');

  html5Slider.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];

    if (handle) {
      inputNumber.value = value;
    } else {
      select.value = Math.round(value);
    }
  });

  select.addEventListener('change', function () {
    html5Slider.noUiSlider.set([this.value, null]);
  });
  inputNumber.addEventListener('change', function () {
    html5Slider.noUiSlider.set([null, this.value]);
  });

  /* carousel */
  var swiper1 = new Swiper(".categoriesswiper", {
    slidesPerView: "auto",
    spaceBetween: 12,
  });

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

  var swiper3 = new Swiper(".trendingslides", {
    slidesPerView: "auto",
    spaceBetween: 26,
  });

  var swiper4 = new Swiper(".shopslides", {
    slidesPerView: "auto",
    spaceBetween: 0,
  });


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
$(document).on('click','.logout', function(e){
  app.params.logOut();
 console.log(app);
})

$(document).on('click', '.counter-increase',function(e){
  var countValue =parseInt ($(this).parent().find(".counter-value").text());
  countValue = countValue + 1 ; 
  $(this).parent().find(".counter-value").text(countValue);
  app.params.currentProductDetails.quantity = countValue ; 
  console.log(countValue);
});

$(document).on('click', '.counter-decrease',function(e){
  var countValue = parseInt ($(this).parent().find(".counter-value").text());
  
  if (countValue > 0){
    countValue = countValue -1 ; 
  }
  $(this).parent().find(".counter-value").text(countValue);
  app.params.currentProductDetails.quantity = countValue ; 
  console.log(countValue);

});