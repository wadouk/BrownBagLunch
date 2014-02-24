
// Code taken from js/baggersUtils.js to avoid calling baggersUtils.js because it also include the GoogleMaps JS code, not present in that page...
var baggers = data['baggers'];
if (baggers !== undefined) {
    for (var baggerIndex = 0; baggerIndex < baggers.length; baggerIndex++) {
        var bagger = baggers[baggerIndex];
        bagger['paire'] = (baggerIndex % 2 == 1);
        // On n'utilise plus encodeURIComponent, car cela pose un souci avec le dropdown + Mustache (les liens ne marchent plus)
        bagger['baggerId'] = bagger.name.replace(/ /g, '_');
    }
}
//        addPaireImpaire();

// Use Mustache to fill templates
var template = $('#baggersNavigationBar');
template.html(Mustache.render(template.html(), data));
template = $('#baggersDetails');
template.html(Mustache.render(template.html(), data));
template = $('#filter-box');
template.html(Mustache.render(template.html(), data));

// Manage (un)folding for presentation details
$('span.show-details').click(function() {
    var $icon = $(this).find('i');
    var $blockquote = $(this).next('blockquote');
    if ($blockquote.is(':visible')) {
        $icon.removeClass('icon-caret-down').addClass('icon-caret-right');
        $blockquote.fadeOut();
    } else {
        $icon.removeClass('icon-caret-right').addClass('icon-caret-down');
        $blockquote.fadeIn();
    }
});

$('i.show-filter').click(function() {
    var $div = $('div#filter-subbox');
    if ($div.is(':visible')) {
        $(this).removeClass('icon-caret-down').addClass('icon-caret-right');
        $div.fadeOut();
    } else {
        $(this).removeClass('icon-caret-right').addClass('icon-caret-down');
        $div.fadeIn();
    }
});

$(document).ready(function() {
    // Get list of tags from users
    var tags = [];
    for (var j = 0; j < baggers.length; j++) {
        var bagger = baggers[j];
        if (bagger.tags !== undefined) {
            for (var k = 0; k < bagger.tags.length; k++) {
                var tag = bagger.tags[k];
                if (tags.indexOf(tag) == -1) {
                    tags.push(tag);
                }
                $("div#" + bagger.baggerId).addClass("tag-" + tag.replace(/ /g, '_'));
            }
        }
    }
    function extracted() {
        var $div = $('#tags-filter');
        tags.sort();
        // Create one button per tag in the filter part
        for (var i = 0; i < tags.length; i++) {
            $div.append('<button type="button" class="btn btn-success btn-tag-filter active btn-small" style="margin-bottom: 10px;" data-toggle="button" data-label="tag-' +
                tags[i].replace(/ /g, '_') + '">' + tags[i] + '</button> ');
        }
    }
    extracted();
    // Manage click on a CITY filter
    $('.btn-city-filter').click(function() {
        var $btn = $(this);
        if ($btn.hasClass('active')) {
            $btn.removeClass('btn-success').addClass('btn-default');
        } else {
            $btn.removeClass('btn-default').addClass('btn-success');
        }
        $('div.' + $btn.attr('data-label')).fadeToggle('slow', function() { updateBaggers(); });
    });

    // Manage click on a TAG filter
    $('#tags-filter .btn-tag-filter').click(function() {
        var $btn = $(this);
        console.log('Click on tag ' + $btn.attr('data-label'));
        if ($btn.hasClass('active')) {
            $btn.removeClass('btn-success').addClass('btn-default');
        } else {
            $btn.removeClass('btn-default').addClass('btn-success');
        }
        updateBaggers();
    });

    // Add / Clear all TAG filters
    $('.all-tag-filter').click(function() {
        $(this).closest('div').find('button').addClass('active btn-success').removeClass('btn-default');
        updateBaggers();
    });
    $('.none-tag-filter').click(function() {
        $(this).closest('div').find('button').removeClass('active btn-success').addClass('btn-default');
        updateBaggers();
    });

    updateBaggers();
});

// Count the number of visible baggers, i.e. the number of baggers that fit the filter criteria.
function updateBaggers() {
    // Hide all baggers and cities (it's simpler)
    $("div.bagger:visible").hide();
    $("div[class^=ville]:visible").hide();

    $("#cities-filter button.btn-success").each(function (ic, city) {
        $("#tags-filter button.btn-success").each(function (it, tag) {
            // For each tag activated, we redisplay the bagger with at least this tag
            var baggers = $("div.bagger." + $(tag).attr("data-label") + ":hidden");
            if (baggers.length > 0) {
                $("." + $(city).attr("data-label")).show();
                baggers.show();
            }
            ;
        });
    });

    var nb = $('div.bagger:visible').length;
    var suffix = (nb > 1) ? 's' : '';
    $('#available-baggers').html(nb + ' bagger' + suffix + ' disponible' + suffix);
    if (nb > 0) {
        $('#available-baggers').removeClass('label-important').addClass('label-info');
    } else {
        $('#available-baggers').removeClass('label-info').addClass('label-important');
    }
    return nb;
}
