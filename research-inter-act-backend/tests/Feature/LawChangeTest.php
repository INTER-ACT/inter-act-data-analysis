<?php

namespace Tests\Feature;

use App\LawChange;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LawChangeTest extends TestCase
{
    use WithoutMiddleware;

    public function test_index()
    {
        $this->get('/api/aenderungen')
            ->assertOk()
            ->assertJsonCount(LawChange::all()->count())
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
                "geloescht",
                "conversationRate",
                "paragraph",
                "sort"
            ]]);
    }

    public function test_show(){
        $lawChange=LawChange::find(1);
        $this->get('/api/aenderung/1')
            ->assertOk()
            ->assertJson([
                "aenderungs_id"=>$lawChange->aenderungs_id,
                "gesetzes_id"=>$lawChange->gesetzes_id,
                "user_id"=>$lawChange->user_id,
                "titel_neu"=>$lawChange->titel_neu,
                "gesetzestext_neu"=>$lawChange->gesetzestext_neu,
                "begruendung"=>$lawChange->begruendung,
                "typ"=>$lawChange->typ,
                "aenderungs_bezugs_id"=>$lawChange->aenderungs_bezugs_id,
                "datum"=>$lawChange->datum,
                "ip"=>$lawChange->ip,
                "geloescht"=>$lawChange->geloescht,
                "conversationRate"=>$lawChange->OwnConversationRate()
            ]);
    }

    public function test_export(){
        $this->get('/api/aenderungen/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Änderungsvorschläge.csv");
    }

    public function test_exportOne(){
        $this->get('/api/aenderung/1/csv')
            ->assertNotFound();

        $this->get('/api/aenderung/1/csv?aenderungid&userid&titel_neu&tags&
        gesetzesid&kommentareid&aenderungenid&ratingsid&aenderungs_bezugs_id&datum&gesetzestext_neu&begruendung&referenz')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Änderungsvorschlag1.csv");

        $this->get('/api/aenderung/1/csv?aenderungid&userid&titel_neu&tags&
        gesetzesid&kommentareid&aenderungenid&ratingsid&aenderungs_bezugs_id&datum&gesetzestext_neu&begruendung&referenz&
        kommentare&ratings&bezugs_element&aenderungen=alle&aenderungen_kommentare&aenderungen_ratings')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Änderungsvorschlag1.zip");
    }

    public function test_exportLawChanges(){
        $this->get('/api/aenderung/1/aenderungen/csv?alle')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Änderungsvorschlag1_Änderungsvorschläge.csv");
    }

    public function test_exportComments(){
        $this->get('/api/aenderung/1/kommentare/csv?alle')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Änderungsvorschlag1_Kommentare.csv");
    }

    public function test_exportRatings(){
        $this->get('/api/aenderung/1/ratings/csv?alle')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Änderungsvorschlag1_Ratings.csv");
    }

    public function test_exportReferenceLaw(){
        $this->get('/api/aenderung/1/gesetz/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Änderungsvorschlag1_Paragraph99.csv");
    }

    public function test_exportReference(){
        $this->get('/api/aenderung/4/referenz/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Änderungsvorschlag4_Referenz_Änderungsvorschlag1.csv");
    }

    public function test_showLawChanges(){
        $this->get('/api/aenderung/1/aenderungen')
            ->assertOk()
            ->assertJsonCount(LawChange::find(1)->allLawChanges()->count())
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
        $this->get('/api/aenderung/3/kommentare')
            ->assertOk()
            ->assertJsonCount(LawChange::find(3)->allComments()->count())
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
        $this->get('/api/aenderung/3/ratings')
            ->assertOk()
            ->assertJsonCount(LawChange::find(3)->ratings()->count())
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
}
