<?php

namespace Tests\Feature;

use App\Law;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class LawTest extends TestCase
{
    use WithoutMiddleware;


    public function test_index()
    {
        $this->get('/api/gesetze')
            ->assertOk()
            ->assertJsonCount(Law::all()->count())
        ->assertJsonStructure([[
            "gesetzes_id",
            "gesetz",
            "paragraph",
            "titel",
            "gesetzestext",
            "erklaerung",
            "bgbl",
            "frei",
            "originaltext",
            "datum",
            "user_id",
            "ip",
            "sort",
            "conversationRate",
            "ratingsRate"
        ]]);
    }

    public function test_export()
    {
        $this->get('/api/gesetze/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Paragraphendiskussionen.csv");
    }

    public function test_show(){
        $law=Law::find(1);
        $this->get('/api/gesetz/1')
            ->assertOk()
            ->assertJson([
                "gesetzes_id"=>$law->gesetzes_id,
                "gesetz"=>$law->gesetz,
                "paragraph"=>$law->paragraph,
                "titel"=>$law->titel,
                "gesetzestext"=>$law->gesetzestext,
                "erklaerung"=>$law->erklaerung,
                "bgbl"=>$law->bgbl,
                "frei"=>$law->frei,
                "originaltext"=>$law->originaltext,
            ]);
    }

    public function test_exportOne(){
        $this->get('/api/gesetz/1/csv')
            ->assertNotFound();

        $this->get('/api/gesetz/1/csv?gesetzesid&gesetz&paragraph&titel&
        gesetzestext&aenderungenid&kommentareid&ratingsid&tags&erklearung&datum&originaltext&bgbl')
            ->assertOk()
        ->assertHeader("Content-Disposition","attachment; filename=Paragraph1.csv");

        $this->get('/api/gesetz/1/csv?gesetzesid&gesetz&paragraph&titel&
        gesetzestext&aenderungenid&kommentareid&ratingsid&tags&erklearung&datum&originaltext&bgbl&
        kommentare&ratings&aenderungen=alle&aenderungen_kommentare&aenderungen_ratings')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Paragraph1.zip");
    }

    public function test_exportLawChanges(){
        $this->get('/api/gesetz/1/aenderungen/csv?alle')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Paragraph1_Änderungsvorschläge.csv");
    }

    public function test_exportComments(){
        $this->get('/api/gesetz/1/kommentare/csv?direkte')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Paragraph1_Kommentare.csv");
    }

    public function test_exportRatings(){
        $this->get('/api/gesetz/1/ratings/csv?direkte')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Paragraph1_Ratings.csv");
    }

    public function test_showLawChanges(){
        $this->get('/api/gesetz/1/aenderungen')
            ->assertOk()
            ->assertJsonCount(Law::find(1)->allLawChanges()->count())
            ->assertJsonStructure([[
                "aenderungs_id",
                "gesetzes_id",
                "user_id",
                "titel_neu",
                "gesetzestext_neu",
                "begruendung",
                "typ",
                "aenderungs_bezugs_id",
                "datum",
                "ip",
                "geloescht"
            ]]);
    }

    public function test_showComments(){
        $this->get('/api/gesetz/1/kommentare')
            ->assertOk()
            ->assertJsonCount(Law::find(1)->allComments()->count())
            ->assertJsonStructure([[
                "kommentar_id",
                "user_id",
                "typ",
                "kommentar_bezugs_id",
                "kommentar",
                "likes",
                "datum",
                "ip",
                "geloescht"
            ]]);
    }

    public function test_showRatings(){
        $this->get('/api/gesetz/1/ratings')
            ->assertOk()
            ->assertJsonCount(Law::find(1)->ratings()->count())
            ->assertJsonStructure([[
                "rating_id",
                "user_id",
                "typ",
                "aspect",
                "wertung",
                "rating_bezugs_id",
                "datum",
                "ip"
            ]]);
    }

    public function test_showStatistics(){
        $this->get('/api/gesetz/5/statistiken')
            ->assertOk()
            ->assertJsonCount(Law::find(5)->statistics()->count())
            ->assertJsonStructure([[
                'statistik_id',
                'gesetzes_id',
                'user_id',
                'link_ort',
                'datum'
            ]]);
    }
}
