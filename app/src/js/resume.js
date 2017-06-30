$(function () {
  var item = $('.nav').find('li');
  item.hover(function () {
    $(this).find('span').removeClass('fadeOut').addClass('fadeIn');
  }, function () {
    $(this).find('span').removeClass('fadeIn').addClass('fadeOut');
  });

  $('#fullpage').fullpage({
    anchors: ['home', 'project', 'skills', 'education', 'career', 'intention', 'download'],
    navigation: true,
    navigationPosition: 'left',
    navigationTooltips: ['首页', '项目', '技能', '教育', '职业', '意向', '更多'],
    showActiveTooltip: true,
    slidesNavigation: false,
    slidesNavPosition: 'bottom',

    css3: true,
    scrollingSpeed: 1000,
    menu: '#menu'
  });
});