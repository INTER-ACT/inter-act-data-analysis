<html lang="de">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css" integrity="sha384-Smlep5jCw/wG7hdkwQ/Z5nLIefveQRIY9nfy6xoR1uRYBtpZgI6339F5dgvm/e9B" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous" charset="utf-8"></script>
    <title>Userspezifische Gesetzesfassung</title>
</head>
<body>

</body>
<script type="text/javascript" charset="utf-8">

    paragraphs=<?php echo json_encode($laws) ?>.forEach(function (law) {
        $('body').append(function () {
                var hastitle='';
                if(law.titel!='')
                {
                    hastitle= " - "
                }
                if(law.typ=='a')
                {
                    console.log('änderung'+law.titel);
                    return '<div class="shadow border p-3 rounded" style="margin: 10px; background-color: rgba(33,86,140,0.2)">\n' +
                        '        <h4 style="margin-bottom: 10px">§'+law.paragraph+hastitle +law.titel+'</h4>\n' +
                        '        "'+law.gesetzestext+'"\n' +
                        '    </div>';
                }
            return'<div class="shadow border p-3 rounded" style="margin: 10px">\n' +
                '        <h4 style="margin-bottom: 10px">§'+law.paragraph+hastitle +law.titel+'</h4>\n' +
                '        "'+law.gesetzestext+'"\n' +
                '    </div>';
        }
            );
    });
</script>