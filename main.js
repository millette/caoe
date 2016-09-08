/* global $ */
$(function () {
  const $modal = $('#modal')
  const apiURL = 'https://openclipart.org/search/json/'
  const $sort = $('#sort')
  const $search = $('#search')
  const $count = $('#count')
  const $images = $('#images')
  const $go = $('#go')
  const $form = $('form')
  var timer

  const imgClick = function (ev) {
    const $self = $(this)
    const it = $self.data('info')
    const directives = {
      title: { href: function () { return this.detail_link } },
      tags_array: { label: { text: function () { return this.value } } },
      svg: { src: function () { return this.svg.url } }
    }
    $modal.render(it, directives)
    $modal.foundation('open')
  }

  const addImg = function (img) {
    const $img = $('<img class="thumbnail" src="' + img.svg.png_thumb + '">')
    $img.data('info', img)
    $img.one('load', function (ev) { $(this).fadeIn() })
    $img.click(imgClick)
    const $el = $('<div class="column small-6 medium-4 large-2">')
    $el.html($img)
    $images.append($el)
  }

  const addImgs = function (data) {
    clearInterval(timer)
    $images.empty()
    data.payload.forEach(addImg)
    $go.text('Go').removeClass('warning')
    $form.prop('disabled', false)
  }

  const goText = (function () {
    var count = 0
    var str = '1s'
    return function () {
      var r
      if (++count === 3) {
        count = 0
        str = '1s'
      } else {
        for (r = 0; r < count; ++r) { str += '.' }
      }
      $go.text(str)
    }
  })()

  const fetchResults = function () {
    const query = {
      query: $search.val(),
      amount: $count.val(),
      sort: $sort.val()
    }
    $go.text('1s').addClass('warning')
    timer = setInterval(goText, Math.log($count.val()) * 80)
    $form.prop('disabled', true)
    $modal.foundation('close')
    $.getJSON(apiURL, query, addImgs)
  }

  const formSubmit = function (ev) {
    ev.preventDefault()
    fetchResults()
  }

  $(document).foundation()

  $('.tags_array').on('click', '.label', function () {
    $search.val($(this).text())
    fetchResults()
  })

  $form.submit(formSubmit)
})
