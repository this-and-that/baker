/**
 *  main.js
 *
 *  Ken Frederick
 *  ken.frederick@gmx.de
 *
 *  http://kennethfrederick.de/
 *  http://blog.kennethfrederick.de/
 *
 *
 *  credit given where credit is due
 *
 *
 *  http://thisetthatmagazine.tumblr.com/
 *  http://github.com/this-and-that/
 *
 *  Licensed under The MIT License
 *  http://opensource.org/licenses/MIT
 *
 */



// ------------------------------------------------------------------------
//
// Properties
//
// ------------------------------------------------------------------------
/*
 *  Orientation
 */
var ios;
var device = {
    isiPad: null,
    isiPhone: null,
    isiPod: null,
    isSafari: null,
    isAndroid: null
};
var orientation;


/*
 *  Article
 */
// global holders for the various parts of an article
// generic to be reused by all articles
var filename = (filename != undefined) ? filename : null;
var article = {};


/*
 *  Events
 */
var scrollContainer = '.article';
var scrollSelector = '.page';


/*
 *  Callbacks
 */
function onReady(pageIndex) {};

// onepage-scroll callbacks
// Article
function onArticleLoad(pageIndex) {};
function onBeforeArticlePage(pageIndex, nextIndex) {};
function onAfterArticlePage(pageIndex) {};
// Gallery
function onGalleryLoad(pageIndex) {};
function onBeforeGalleryPage(pageIndex, nextIndex) {};
function onAfterGalleryPage(pageIndex) {};


/*
 *  Misc.
 */
var bRedirected = false;





// ------------------------------------------------------------------------
//
// Loaded
//
// ------------------------------------------------------------------------
/*
 *  DOM is loaded
 */
// $(function() {
$(document).load(function() {
    /*
     *  Orientation
     */
    angle = 0; // orienation angle
    isRotated = false;

    ios = navigator.userAgent.match(/(iPhone)|(iPod)|(iPad)/);
    device.isiPad   = (navigator.userAgent.match(/iPad/i) != null);
    device.isiPhone  = (navigator.userAgent.match(/iPhone/i) != null);
    device.isiPod   = (navigator.userAgent.match(/iPod/i) != null);
    device.isSafari  = (navigator.userAgent.match(/Safari/i) != null);
    device.isAndroid = (navigator.userAgent.match(/Android/i) != null);

    // initial orientation check
    orientation = 'landscape';
    orientationChange();

    /*
     *  Check Connection status
     */
    console.log( 'online', navigator.onLine );
    if(!(navigator.onLine) && !bRedirected ) {
        window.location = './oops.html';
        bRedirected = true;
    }


});




// ------------------------------------------------------------------------
//
// Ready
//
// ------------------------------------------------------------------------
/*
 *  DOM is ready
 */
$(document).ready(function() {
    /*
     *  Links
     */
    // $('a').click( function(event) {
    //  event.preventDefault();
    //  window.location = $(this).attr('href');
    // });

    // keep all links within webapp
    // crucial for testing purposes
    var a = document.getElementsByTagName('a');
    for( var i=0; i<a.length; i++ ) {
        if( !a[i].onclick && a[i].getAttribute('target') != '_blank' ) {
            a[i].onclick = function() {
                window.location = this.getAttribute('href');
                return false;
            }
        }
    }

    // http://stackoverflow.com/questions/7901679/jquery-add-target-blank-for-outgoing-link
    // $('a[href^="htt"]').each(function() {
    //  var link = $(this).attr('href');

    //  // within normal browser
    //  // open external links in a new window/tab
    //  $(this).attr('target', '_blank');
    // });


    /*
     *  Misc
     */
    loadArticle();
    orientationChange();

    // get active page
    onReady( $(scrollContainer + ' ' + scrollSelector + '.active').data('index') );

    // serve up retina images
    $('img').retina('@2x');

    // set carousel globally
    $('.carousel').carousel({
        interval: 5000,
        pause: 'false'
    });


    /*
     *  Events
     */
    // $('a').bind('click touchstart', function(e) {
        // alert("I'm a " + e.type);
        // e.preventDefault();
    // });

    $('#main-menu').bind('click touchstart', function() {
        console.log( '#main-menu' );
        $('.baseline-grid-view').toggleOpacity();
    });

    // if the link is a gallery link, then it should
    // not only open the gallery, but to the right page
    // $('.gallery-link').click(function() {
    $('.gallery-link').bind('click touchstart', function() {
        toggleGallery( $(this) );
    });
    $('#gallery-close').bind('click touchstart', function() {
        toggleGallery( $(this) );
    });


    // http://stackoverflow.com/questions/1207008/how-do-i-lock-the-orientation-to-portrait-mode-in-a-iphone-web-application
    // $(window)
    //  .bind('orientationchange', function(){
    //      if (window.orientation % 180 == 0){
    //          $(document.body).css('-webkit-transform-origin', '')
    //              .css('-webkit-transform', '');
    //      }
    //      else {
    //          if ( window.orientation > 0) { //clockwise
    //              $(document.body).css('-webkit-transform-origin', '200px 190px')
    //                  .css('-webkit-transform',  'rotate(-90deg)');
    //          }
    //          else {
    //              $(document.body).css('-webkit-transform-origin', '280px 190px')
    //                      .css('-webkit-transform',  'rotate(90deg)');
    //          }
    //      }
    //   })
    //  .trigger('orientationchange');

});



// ------------------------------------------------------------------------
//
// Methods
//
// ------------------------------------------------------------------------
/*
 *  Orientation
 */
//
//  TODO: tweak orientation settings to procure correct angle
//
function orientationChange() {
    /*
     *  Orientation
     */
    isRotated = true;

    // angle = window.orientation;

    // if(window.orientation == 90 || window.orientation == -90)    orientation = 'landscape';
    if(window.orientation == 0 || window.orientation == 180) orientation = 'portrait';

    if (window.orientation == -90) {
        angle = 90;
    }
    if (window.orientation == 90) {
        angle = -90;
    }
    if (window.orientation == 0) {
        angle = 0;
    }


    /*
     *  Pages
     */
    // set placement of pages
    paginate();

};


// ------------------------------------------------------------------------
function paginate() {

    $('.gallery').onepage_scroll({
        sectionContainer: '.gallery ' + scrollSelector
        // easing: 'cubic-bezier(.02, .01, .47, 1)',
        // // first page = last page = easeOutBounce
        // animationTime: 400,
        // pagination: false,
        // updateURL: true,
        // direction: 'horizontal',
        // touchTarget: '#navigation',
        // // loop: true,

        // onLoad: function(pageIndex) {
        //  onGalleryLoad(pageIndex);
        // },
        // beforeMove: function(pageIndex, nextIndex) {
        //  onBeforeGalleryPage(pageIndex, nextIndex);
        // },
        // afterMove: function(pageIndex) {
        //  onAfterGalleryPage(pageIndex);
        // }
    });

    $('.article').onepage_scroll({
        sectionContainer: '.article ' + scrollSelector,
        easing: 'cubic-bezier(.02, .01, .47, 1)',
        // first page = last page = easeOutBounce
        animationTime: 500,
        pagination: false,
        updateURL: true,
        direction: 'horizontal',
        touchTarget: '#navigation',

        onLoad: function(pageIndex) {
            onArticleLoad(pageIndex);
        },
        beforeMove: function(pageIndex, nextIndex) {
            onBeforeArticlePage(pageIndex, nextIndex);
        },
        afterMove: function(pageIndex) {
            onAfterArticlePage(pageIndex);
        }
    });

};

// ------------------------------------------------------------------------
function scrollBack() {
    $(scrollContainer).moveUp();
};
function scrollForward() {
    $(scrollContainer).moveDown();
};
function scrollTo(element) {
    var index = $(element).data('index');
    var delta = index - ($(scrollSelector+'.active').data('index') - 1);
    if( delta > 0 ) {
        $(scrollContainer).moveDown(Math.abs(delta)-1);
    }
    else {
        $(scrollContainer).moveUp(Math.abs(delta)+1);
    }
};


// ------------------------------------------------------------------------
function toggleGallery(element) {
    $('.gallery').toggleOpacity();
    $('.gallery-navigation').toggleOpacity();
};

// ------------------------------------------------------------------------
$.fn.toggleOpacity = function(val) {
    // by toggling css opacity the css transitions
    // are triggered, yeah! limited jquery
    if( val == undefined ) {
        var opacity = $(this).css('opacity');
        val = (opacity >= 1.0) ? false : true;
    }
    $(this).css('opacity',
        (val) ? 1.0 : 0.0
    );
};

// ------------------------------------------------------------------------
// TODO: simplify color fading of pages
// hmm... seems a bit over complicated no?
$.fn.fadeToBlack = function(toggleClass, onPage, currentPage, nextPage) {
    if( currentPage == onPage-1 && nextPage == onPage ||
             currentPage == onPage+1 && nextPage == onPage ) {
        $(this).addClass( 'black' );
        $(this).removeClass( toggleClass );

        // this will invert all elements that have .black-dark-gray as a class
        $( '.black-dark-gray' ).addClass( 'white-light-gray' );
        $( '.black-dark-gray' ).removeClass( 'black' );
        $( '.black-dark-gray' ).removeClass( 'black-dark-gray' );
    }
    else if( currentPage == onPage && nextPage == onPage+1 ||
             currentPage == onPage && nextPage == onPage-1 ) {
        $(this).addClass( toggleClass );
        $(this).removeClass( 'black' );

        $( '.white-light-gray' ).addClass( 'black-dark-gray' );
        $( '.white-light-gray' ).removeClass( 'white-light-gray' );
    }
    else if(currentPage == onPage) {
        $(this).addClass( 'black' );
        $(this).removeClass( toggleClass );

        $( '.black-dark-gray' ).addClass( 'white-light-gray' );
        $( '.black-dark-gray' ).removeClass( 'black' );
        $( '.black-dark-gray' ).removeClass( 'black-dark-gray' );
    }
};


// ------------------------------------------------------------------------
/*
 *  Article
 */
// load the article as a from a .json file
// the idea is to make editing and updating easier
// a pseudo-cms
// TODO: eventually like to use markdown, but unsure
// where to start
function loadArticle(structure) {
    structure = (structure != undefined)
        ? structure
        : article;

    console.log( 'loadArticle( ' + structure + ' )' );

    // load article json
    if(filename === undefined || filename === null) {
        console.log( 'filename: ' + typeof filename );
        return;
    }
    else {
        console.log( 'loadArticle() getJSON( ' + filename + ' )' );
        $.getJSON('copy/'+filename, function(data) {
            // info block
            subject = data.article.info.subject;
            title = data.article.info.title;
            author = data.article.info.author;
            // introduction paragraphs
            intro = data.article.intro.text;
            // content
            main = data.article.main.text;
            interview = data.article.interview.text;
            // images
            images = data.article.captions.text;

            structure = {
                subject:    jsonToHtml( subject, 'subject' ),
                title:      jsonToHtml( title, 'title' ),
                author:     jsonToHtml( author, 'author' ),
                intro:      jsonToHtml( intro, 'intro' ),
                main:       jsonToHtml( main, 'main' ),
                interview:  jsonToHtml( interview, 'interview' ),
                images:     jsonToHtml( images, 'captions' )
            };

        });
    }

    return structure;
};

// might be worth doing this without jquery
// http://stackoverflow.com/questions/327047/what-is-the-most-efficient-way-to-create-html-elements-using-jquery
function jsonToHtml(arr, idName) {
    var i = 0;
    var id = '';
    for(i=0; i<arr.length; i++) {
        id = '#'+idName+(i).toString();

        if( idName == 'captions' ) {
            // handle captions a bit diffrently
            // they are treated like lists
            // <h6> are captions as defined in this-and-that.less
            $( id ).html( '<h6><ul class="caption"><li><span>' + arr[i].title + '</span></li><li><span>' + arr[i].body + '</span></li></ul></h6>' );
        }
        else {
            // everything else
            // <h5> is body copy as defined in this-and-that.less
            $( id ).html( '<h5>' + arr[i] + '</h5>' );
        }
    }
};


// ------------------------------------------------------------------------
/*
 *  Cookies
 *  http://www.quirksmode.org/js/cookies.html
 */
 function saveCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = '; expires=' + date.toGMTString();
    }
    else var expires = '';
    document.cookie = name + '=' + value + expires + '; path=/';
};

 function openCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};

 function deleteCookie(name) {
    saveCookie(name, '', -1);
};


/*
 *  Local Storage
 */
function saveSession(name, value) {
    if(window.sessionStorage) {
        sessionStorage.setItem(name, String(value));
    }
    else {
        console.error('sessionStorage not supported');
    }
};

function getSession(name) {
    return sessionStorage.getItem(name);
};

function deleteSession(name) {
    sessionStorage.removeItem(name);
};




// ------------------------------------------------------------------------
//
// Events
//
// ------------------------------------------------------------------------
$(window).resize(function() {
    orientationChange();
});


// ------------------------------------------------------------------------
$(window).scroll(function() {
});


