$(document).ready(function () {
  $('#fullpage').fullpage({
    anchors: ['home', 'project', 'skills', 'education', 'career', 'intention', 'download'],
    navigation: true,
    navigationPosition: 'left',
    navigationTooltips: ['首页', '项目', '技能', '教育', '职业', '意向', '更多'],
    showActiveTooltip: true,
    slidesNavigation: true,
    slidesNavPosition: 'bottom',

    scrollingSpeed: 1000,

    controlArrows: false,
    loopHorizontal: true,

    afterRender: function () {
      $(this).find('.slide.project-bootstrap .fp-tableCell').load('../../html/bootstrap.html');
      $(this).find('.slide.project-react .fp-tableCell').load('../../html/react.html');
      $(this).find('.slide.project-bpm .fp-tableCell').load('../../html/bpm.html');
    }
  });
});
