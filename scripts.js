(function($) {
  "use strict";

  // Variables

  if (!window.location.origin) {
    window.location.origin =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");
  }

  var url_base = window.location.origin;
  if (url_base === "http://localhost") {
    url_base = "http://localhost/flaunter";
  }
  if (url_base === "http://haydenbarnett.com") {
    url_base = "http://haydenbarnett.com/demo/flaunter";
  }
  if (!url_base) {
    url_base = "https://www.flaunter.com";
  }

  // Functions

  $(".share-link a").on("click", function() {
    share_popup($(this));
    return false;
  });

  function share_popup($this) {
    var shareurl = $this.attr("href"),
      top = (screen.availHeight - 500) / 2,
      left = (screen.availWidth - 500) / 2;
    window.open(
      shareurl,
      "Share",
      "width=550,height=420,left=" +
        left +
        ",top=" +
        top +
        ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1"
    );
  }

  function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
      if (timeout) {
        clearTimeout(timeout);
      }
      function delayed() {
        fn();
        timeout = null;
      }
      timeout = setTimeout(delayed, threshold || 100);
    };
  }

  // Mixins

  _.mixin({
    sortKeysBy: function(obj, comparator) {
      var keys = _.sortBy(_.keys(obj), function(key) {
        return comparator ? comparator(obj[key], key) : key;
      });

      return _.zipObject(
        keys,
        _.map(keys, function(key) {
          return obj[key];
        })
      );
    }
  });

  // Toggle sidebar menu

  $("#more-menu").removeClass("hidden");

  $(".menu-more a, #more-menu-overlay").on("click", function() {
    $("#header, #content, #footer").toggleClass("slide-open");
    $(".menu-more a, #more-menu, #more-menu-overlay").toggleClass("active");
    return false;
  });

  // Toggle mobile menu

  $(".hamburger").on("click", function() {
    $("#mobile-menu").toggleClass("active");
    $(".hamburger").toggleClass("active");
    $("#header").toggleClass("menu-opened");
    return false;
  });

  // Toggle modals
  $(".js-modal-trigger").on("click", function() {
    var modal = $(this).attr("data-modal");
    $(".js-" + modal + "-modal").addClass("active");
    var embedCode = $(".js-" + modal + "-modal .video-container").attr(
      "data-embed"
    );
    $(".js-" + modal + "-modal .video-container").html(embedCode);
  });

  $(".js-close-modal").on("click", function() {
    $(".modal-overlay").removeClass("active");
    $(".modal-overlay .video-container").html("");
  });

  // Auto wrap iframes with responsive container

  $("iframe").wrap('<div class="video-container"/>');

  // Smooth scroll links

  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .on("click", function(event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");

        if (target.length) {
          var scroll = target.offset().top;
          if ($(this).attr("data-offset")) {
            scroll += parseInt($(this).attr("data-offset"));
          }
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: scroll
            },
            600,
            function() {
              //
            }
          );
        }
      }
    });

  // Parallax

  if ($("#home-hero").length) {
    $("[data-paroller-factor]").paroller();
  }

  // Fixed brands menu

  if ($("#brands-navigation").length) {
    var $brands_menu = $("#brands-menu"),
      $brands_navigation = $("#brands-navigation");

    $(window).on("scroll", function() {
      if (window.scrollY >= $brands_navigation.offset().top) {
        $brands_menu.addClass("fixed");
      } else {
        if ($brands_menu.hasClass("fixed")) {
          $brands_menu.removeClass("fixed");
        }
      }
    });
  }

  // Testimonials

  if ($("#testimonials").length) {
    $(".testimonial-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: false,
      draggable: false,
      swipe: false,
      swipeToSlide: false,
      touchMove: false,
      accessibility: "false",
      infinite: true,
      speed: 400,
      fade: true,
      cssEase: "linear",
      asNavFor: ".testimonial-authors"
    });

    $(".testimonial-authors").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 6000,
      speed: 400,
      fade: true,
      cssEase: "linear",
      asNavFor: ".testimonial-slider"
    });

    $(".testimonial-authors .slider-next").on("click", function() {
      $(".testimonial-authors").slick("slickNext");
      return false;
    });
  }

  // Blog Featured

  if ($("#post-featured").length) {
    $("#post-featured").slick({
      arrows: false,
      autoplay: true,
      autoplaySpeed: 6000,
      cssEase: "linear",
      dots: false,
      fade: true,
      infinite: true,
      pauseOnFocus: false,
      pauseOnHover: false,
      slidesToScroll: 1,
      slidesToShow: 1,
      speed: 400
    });

    $("#post-featured").on("afterChange", function() {
      // Rerender the progress bar when changing slide so it resets when you click next
      $(".js-blog-progress").html($(".js-blog-progress").html());
    });

    $("#post-featured .slider-next").on("click", function() {
      $("#post-featured").slick("slickNext");
      return false;
    });
  }

  // Blog Categories

  if ($("#post-categories").length) {
    var active_cat = $("#post-categories").attr("data-active");

    if (active_cat) {
      $('.categories-list a:contains("' + active_cat + '")').addClass("active");
    }

    $("#post-categories .search-submit").on("click", function() {
      if ($("#post-categories .search-field").val() == "") {
        return false;
      }
    });
  }

  // Blog subscribe

  if ($("#widget-subscribe").length) {
    var $subscribe_panel = $("#widget-subscribe"),
      subscribe_closed = false;

    $(window).on("scroll", function() {
      if (!subscribe_closed) {
        if (window.scrollY >= 400) {
          $subscribe_panel.addClass("active");
        } else {
          if ($subscribe_panel.hasClass("active")) {
            $subscribe_panel.removeClass("active");
          }
        }
      }
    });

    $("#widget-subscribe .close").on("click", function() {
      $subscribe_panel.removeClass("active");
      subscribe_closed = true;
      return false;
    });
  }

  // Fixed careers menu

  if ($("#careers-list").length) {
    var $careers_panel = $(".careers-panel-scroll"),
      $careers_section = $("#careers-list");

    $(window).on("scroll", function() {
      if (window.scrollY >= $careers_section.offset().top) {
        $careers_panel.addClass("fixed");
      } else {
        if ($careers_panel.hasClass("fixed")) {
          $careers_panel.removeClass("fixed");
        }
      }
    });

    var $career_content = $(".careers-content-inline"),
      $career_links = $(".career-link"),
      career_offsets = [],
      i = 0;

    $career_content.each(function(index) {
      career_offsets.push($(this).offset().top);
    });

    $career_links.each(function(index) {
      $(this).attr("scroll-id", index);
    });

    $(window).on("scroll", function() {
      var scrollPosition = window.scrollY;
      for (i in career_offsets) {
        if (scrollPosition >= career_offsets[i] - 100) {
          $(".career-link.active").removeClass("active");
          $(".career-link[scroll-id=" + i + "]").addClass("active");
        }
      }
    });
  }

  // Select toggle
  $("select").each(function() {
    var $this = $(this),
      numberOfOptions = $(this).children("option").length;

    $this.addClass("select-hidden");
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next("div.select-styled");
    $styledSelect.text(
      $this
        .children("option")
        .eq(0)
        .text()
    );

    var $list = $("<ul />", {
      class: "select-options"
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $("<li />", {
        text: $this
          .children("option")
          .eq(i)
          .text(),
        rel: $this
          .children("option")
          .eq(i)
          .val(),
        class:
          "select-" +
          $this
            .children("option")
            .eq(i)
            .val()
      }).appendTo($list);
    }

    var $listItems = $list.children("li");

    $styledSelect.click(function(e) {
      e.stopPropagation();
      $("div.select-styled.active")
        .not(this)
        .each(function() {
          $(this)
            .removeClass("active")
            .next("ul.select-options")
            .hide();
        });
      $(this)
        .toggleClass("active")
        .next("ul.select-options")
        .toggle();
    });

    $listItems.click(function(e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass("active");
      $this.val($(this).attr("rel"));
      $list.hide();
    });

    $(document).click(function() {
      $styledSelect.removeClass("active");
      $list.hide();
    });
  });

  // Switches on the pricing page
  $(".toggle-features").on("click", function() {
    $("#pricing-table .hidden-feature").toggleClass("revealed-feature");
    $("#pricing-table .toggle-feature-text").toggleClass("hidden-text");
  });

  $(".pricing-popover").on("click", function() {
    $(this).toggleClass("popover-active");
  });

  $(".see-all-features").on("click", function() {
    $(this)
      .prev()
      .toggleClass("list-shown");
  });

  $("#monthly-checkbox").click(function() {
    $(".price-yearly").removeClass("yearly-revealed");
    $(".price-monthly").addClass("monthly-revealed");
  });

  $("#yearly-checkbox").click(function() {
    $(".price-yearly").addClass("yearly-revealed");
    $(".price-monthly").removeClass("monthly-revealed");
  });

  $(".select-aud").click(function() {
    $(".price-aud").each(function() {
      $(this).addClass("price-aud-revealed");
    });
    $(".price-usd").each(function() {
      $(this).removeClass("price-usd-revealed");
    });
    $(".price-euro").each(function() {
      $(this).removeClass("price-euro-revealed");
    });
    $(".price-gbp").each(function() {
      $(this).removeClass("price-gbp-revealed");
    });
  });

  $(".select-usd").click(function() {
    $(".price-aud").each(function() {
      $(this).removeClass("price-aud-revealed");
    });
    $(".price-usd").each(function() {
      $(this).addClass("price-usd-revealed");
    });
    $(".price-euro").each(function() {
      $(this).removeClass("price-euro-revealed");
    });
    $(".price-gbp").each(function() {
      $(this).removeClass("price-gbp-revealed");
    });
  });

  $(".select-euro").click(function() {
    $(".price-aud").each(function() {
      $(this).removeClass("price-aud-revealed");
    });
    $(".price-usd").each(function() {
      $(this).removeClass("price-usd-revealed");
    });
    $(".price-euro").each(function() {
      $(this).addClass("price-euro-revealed");
    });
    $(".price-gbp").each(function() {
      $(this).removeClass("price-gbp-revealed");
    });
  });

  $(".select-gbp").click(function() {
    $(".price-aud").each(function() {
      $(this).removeClass("price-aud-revealed");
    });
    $(".price-usd").each(function() {
      $(this).removeClass("price-usd-revealed");
    });
    $(".price-euro").each(function() {
      $(this).removeClass("price-euro-revealed");
    });
    $(".price-gbp").each(function() {
      $(this).addClass("price-gbp-revealed");
    });
  });

  // FAQ Selector

  $(".js-faq-toggle a").click(function(e) {
    var key = $(this).attr("data-key");
    $(".js-faq-toggle a").removeClass("active");
    $(this).addClass("active");

    $(".faq-section").addClass("display-none");
    $("#faq-" + key).removeClass("display-none");
  });
})(jQuery);
