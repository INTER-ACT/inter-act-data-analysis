
<html lang="de">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css" integrity="sha384-Smlep5jCw/wG7hdkwQ/Z5nLIefveQRIY9nfy6xoR1uRYBtpZgI6339F5dgvm/e9B" crossorigin="anonymous">

    <title>Wordcloud</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3.js" charset="utf-8"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.js" charset="utf-8"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous" charset="utf-8"></script>
</head>
<body>
<div id=wordcloud ></div>
</body>
<script type="text/javascript" charset="utf-8">

    //<script src="d3.wordcloud.js" charset="utf-8"><\script>
    (function() {
        function wordcloud() {
            var selector = '#wordcloud',
                element = d3.select(selector),
                transitionDuration = 200,
                scale = 'sqrt',
                fill = d3.scale.category20c(),
                layout = d3.layout.cloud().rotate(function() { return ~~(Math.random() * 2) * 90; }),
                fontSize = null,
                svg = null,
                vis = null,
                onwordclick = undefined;

            wordcloud.element = function(x) {
                if (!arguments.length) return element;
                element = x == null ? '#wordcloud' : x;
                return wordcloud
            };

            wordcloud.selector = function(x) {
                if (!arguments.length) return selector;
                element = d3.select(x == null ? selector : x);
                return wordcloud;
            };

            wordcloud.transitionDuration = function(x) {
                if (!arguments.length) return transitionDuration;
                transitionDuration = typeof x == 'function' ? x() : x;
                return wordcloud;
            };

            wordcloud.scale = function(x) {
                if (!arguments.length) return scale;
                scale = x == null ? 'sqrt' : x;
                return wordcloud;
            };

            wordcloud.fill = function(x) {
                if (!arguments.length) return fill;
                fill = x == null ? d3.scale.category20c() : x;
                return wordcloud;
            };

            wordcloud.onwordclick = function (func) {
                onwordclick = func;
                return wordcloud;
            }

            wordcloud.start = function() {
                init();
                layout.start(arguments);

                return wordcloud;
            };

            function init() {
                layout
                    .fontSize(function(d) {
                        return fontSize(+d.size);
                    })
                    .text(function(d) {
                        return d.text;
                    })
                    .on("end", draw);

                svg = element.append("svg");
                vis = svg.append("g").attr("transform", "translate(" + [layout.size()[0] >> 1, layout.size()[1] >> 1] + ")");
                update();
                svg.on('resize', function() { update()});
                //resizeFn();
            }

            function draw(data, bounds) {
                var w = layout.size()[0],
                    h = layout.size()[1];

                svg.attr("width", w).attr("height", h);

                scaling = bounds ? Math.min(
                    w / Math.abs(bounds[1].x - w / 2),
                    w / Math.abs(bounds[0].x - w / 2),
                    h / Math.abs(bounds[1].y - h / 2),
                    h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

                var text = vis.selectAll("text")
                    .data(data, function(d) {
                        return d.text.toLowerCase();
                    });
                text.transition()
                    .duration(transitionDuration)
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("font-size", function(d) {
                        return d.size + "px";
                    });
                text.enter().append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("font-size", function(d) {
                        return d.size + "px";
                    })
                    .style("opacity", 1e-6)
                    .transition()
                    .duration(transitionDuration)
                    .style("opacity", 1);
                text.style("font-family", function(d) {
                    return d.font || layout.font() || svg.style("font-family");
                })
                    .style("fill", function(d) {
                        return fill(d.text.toLowerCase());
                    })
                    .text(function(d) {
                        return d.text;
                    })
                    // clickable words
                    .style("cursor", function(d, i) {
                        if (onwordclick !== undefined) return 'pointer';
                    })
                    .on("mouseover", function(d, i) {
                        if (onwordclick !== undefined) {
                            d3.select(this).transition().style('font-size', d.size + 3 + 'px');
                        }
                    })
                    .on("mouseout", function(d, i) {
                        if (onwordclick !== undefined) {
                            d3.select(this).transition().style('font-size', d.size + 'px');
                        }
                    })
                    .on("click", function(d, i) {
                        if (onwordclick !== undefined) {
                            onwordclick(d,i);
                        }
                    });

                vis.transition()
                    .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scaling + ")");
            };

            function update() {
                var words = layout.words();
                fontSize = d3.scale[scale]().range([10, 50]);
                if (words.length) {
                    fontSize.domain([+words[words.length - 1].size || 1, +words[0].size]);
                }

            }
            return d3.rebind(wordcloud, layout, 'on', 'words', 'size', 'font', 'fontStyle', 'fontWeight', 'spiral', 'padding');
        }
        if (typeof module === "object" && module.exports) module.exports = wordcloud;
        else d3.wordcloud = wordcloud;
    })();
    var count=0;
    //  <script src="example.words.js" charset="utf-8"><\script>
    var words = [
        {text: 'have', size: 20},
        {text: 'Oliver', size: 47},
        {text: 'say', size: 46},
        {text: 'said', size: 36},
        {text: 'bumble', size: 29},
        {text: 'will', size: 29},
        {text: 'Mrs', size: 56},
        {text: 'Mann', size: 27},
        {text: 'Mr', size: 27},
        {text: 'very', size: 26},
        {text: 'child', size: 20},
        {text: 'all', size: 19},
        {text: 'boy', size: 19},
        {text: 'gentleman', size: 19},
        {text: 'great', size: 19},
        {text: 'take', size: 19},
        {text: 'but', size: 18},
        {text: 'beadle', size: 16},
        {text: 'twist', size: 16},
        {text: 'board', size: 15},
        {text: 'more', size: 15},
        {text: 'one', size: 15},
        {text: 'workhouse', size: 15},
        {text: 'parish', size: 14},
        {text: 'there', size: 14},
        {text: 'come', size: 13},
        {text: 'hand', size: 13},
        {text: 'know', size: 13},
        {text: 'sir', size: 13},
        {text: 'being', size: 12},
        {text: 'head', size: 12},
        {text: 'make', size: 12},
        {text: 'out', size: 12},
        {text: 'can', size: 11},
        {text: 'little', size: 11},
        {text: 'reply', size: 11},
        {text: 'any', size: 10},
        {text: 'cry', size: 10},
        {text: 'good', size: 10},
        {text: 'name', size: 10},
        {text: 'poor', size: 10},
        {text: 'time', size: 10},
        {text: 'think', size: 8},
        {text: 'too', size: 8},
        {text: 'walk', size: 8},
        {text: 'want', size: 8},
        {text: 'bless', size: 7},
        {text: 'eye', size: 7},
        {text: 'man', size: 7},
        {text: 'master', size: 7},
        {text: 'most', size: 7},
        {text: 'old', size: 7},
        {text: 'people', size: 7},
        {text: 'see', size: 7},
        {text: 'another', size: 6},
        {text: 'at all', size: 6},
        {text: 'authorities', size: 6},
        {text: 'authority', size: 6},
        {text: 'away', size: 6},
        {text: 'drop', size: 5},
        {text: 'eyes', size: 5},
        {text: 'fall', size: 5},
        {text: 'find', size: 5},
        {text: 'gin', size: 5},
        {text: 'high', size: 5},
        {text: 'house', size: 5},
        {text: 'infant', size: 5},
        {text: 'night', size: 5},
        {text: 'nobody', size: 5},
        {text: 'orphan', size: 5},
        {text: 'pauper', size: 5},
        {text: 'perhaps', size: 5},
        {text: 'rather', size: 5},
        {text: 'round', size: 5},
        {text: 'sit', size: 5},
        {text: 'world', size: 5},
        {text: 'young', size: 5},
        {text: 'add', size: 4},
        {text: 'ask', size: 4},
        {text: 'at once', size: 4},
        {text: 'behind', size: 4},
        {text: 'bottle', size: 4},
        {text: 'bread', size: 4},
        {text: 'care', size: 4},
        {text: 'copper', size: 4},
        {text: 'die', size: 4},
        {text: 'farm', size: 4},
        {text: 'fat', size: 4},
        {text: 'father', size: 4},
        {text: 'fell', size: 4},
        {text: 'female', size: 4},
        {text: 'going', size: 4},
        {text: 'happen', size: 4},
        {text: 'hat', size: 4},
        {text: 'here', size: 4},
        {text: 'age', size: 3},
        {text: 'arm', size: 3},
        {text: 'ask for', size: 3},
        {text: 'assistant', size: 3},
        {text: 'be born', size: 3},
        {text: 'bed', size: 3},
        {text: 'bill', size: 3},
        {text: 'roll', size: 2},
        {text: 'wicket', size: 2},
        {text: 'wild', size: 2},
        {text: 'wisdom', size: 2},
        {text: 'wretched', size: 2},
        {text: 'young woman', size: 2},
        {text: 'a couple of', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'affect', size: 1},
        {text: 'affected', size: 1},
        {text: 'accurate', size: 1},
        {text: 'address', size: 1},
        {text: 'advertise', size: 1},
        {text: 'advertise', size: 1},
        {text: 'advertise', size: 1},
        {text: 'advertise', size: 1}
    ];
    for (i=0; i<words.length;i++)
    {
        words[i].id=i;

    }

    words.sort(function(a, b){return b.size-a.size});
    var getReady=[];
    count=0;
    var paragraphs=[];
    //<script src="lib/GenerateCloud.js" charset="utf-8"><\script>
    paragraphs=<?php echo json_encode($laws) ?>;
    paragraphs.sort(function(a, b){return b.conversationRate-a.conversationRate});
    paragraphs.forEach(function (law) {
        var oneobject={text: '§'+law.paragraph, size: words[count].size,href: "https://www.inter-act.net/UrhG_"+law.paragraph+".html", color: law.ratingsRate, place: words[count].id, id: law.gesetzes_id};
        if(law.user_id!=null)
        {
            oneobject.text= oneobject.text+'*';
        }
        getReady.push(oneobject);
        count++;
    });
    getReady.sort(function(a, b){return a.place-b.place});
    var colors=[
        '#BF360C',
        '#E64A19',
        '#FF5722',
        '#FFAB91',
        '#A5D6A7',
        '#66BB6A',
        '#43A047',
        '#1B5E20'];
    $(document).ready(function () {
        draw(getReady);
    });


    function draw(data) {
        d3.wordcloud()
            .size([1000, 700])
            .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
            .words(data)
            .onwordclick(function(d, i) {
                $.ajax({
                    data: {'gesetzes_id':d.id, 'link_ort': 'w'},
                    type: "post",
                    dataType: 'JSON',
                    url: "statistik",
                    async: false,
                    success: function(data){

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    }
                });
                if (d.href) { window.location = d.href; }
            })
            .font("Arial")
            .start();

        $("#wordcloud svg g text").css('fill', function (element) {
            var color=getReady[element].color;

            if(color>75)
            {
                return colors[7];
            }
            if(color>55&&color<75)
            {
                return colors[6];
            }
            if(color>30&&color<55)
            {
                return colors[5];
            }
            if(color>10&&color<30)
            {
                return colors[4];
            }
            if(color<-10&&color>-30)
            {
                return colors[3];
            }
            if(color<-30&&color>-55)
            {
                return colors[2];
            }
            if(color<-55&&color>-75)
            {
                return colors[1];
            }
            if(color<-75)
            {
                return colors[0];
            }
            return '#000000';
        });
        /*
        setTimeout(function () {
            resizeFn();
        },1000);
        */
    }



</script>
</html>


