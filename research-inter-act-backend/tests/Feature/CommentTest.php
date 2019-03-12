<?php

namespace Tests\Feature;

use App\Comment;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CommentTest extends TestCase
{
    use WithoutMiddleware;

    public function test_index()
    {
        $this->get('/api/kommentare')
            ->assertOk()
            ->assertJsonCount(Comment::all()->count())
            ->assertJsonStructure([[
                "kommentar_id",
                "user_id",
                "typ",
                "kommentar_bezugs_id",
                "kommentar",
                "likes",
                "datum",
                "ip",
                "geloescht",
                "kommentare_likes"
            ]]);
    }

    public function test_show(){
        $comment=Comment::find(2);
        $temp_comments = $comment->allComments();
        $temp_comments_id=array();
        foreach ($temp_comments as $temp_comment)
            array_push($temp_comments_id,$temp_comment->kommentar_id);
        $temp_tags = array();
        $references_tags = $comment->references_tags();
        foreach ($references_tags as $reference_tag)
            array_push($temp_tags, $reference_tag->tag->tag);
        $this->get('/api/kommentar/2')
            ->assertOk()
            ->assertJson([
                "kommentar_id"=>$comment->kommentar_id,
                "user_id"=>$comment->user_id,
                "typ"=>$comment->typ,
                "kommentar_bezugs_id"=>$comment->kommentar_bezugs_id,
                "kommentar"=>$comment->kommentar,
                "likes"=>$comment->likes,
                "datum"=>$comment->datum,
                "ip"=>$comment->ip,
                "geloescht"=>$comment->geloescht,
                "kommentare_id"=>$temp_comments_id,
                "tags"=>$temp_tags,
                "kommentare_likes"=>$comment->comments_likes()->toArray()
            ]);
    }

    public function test_export(){
        $this->get('/api/kommentare/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Kommentare.csv");
    }

    public function test_exportOne(){
        $this->get('/api/kommentar/2/csv')
            ->assertNotFound();

        $this->get('/api/kommentar/2/csv?kommentarid&userid&referenz&kommentar_bezugs_id&
        kommentar&likes&kommentareid&tags&datum')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Kommentar2.csv");

        $this->get('/api/kommentar/2/csv?kommentarid&userid&referenz&kommentar_bezugs_id&
        kommentar&likes&kommentareid&tags&datum&kommentare&bezugs_element')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Kommentar2.zip");
    }

    public function test_exportComments(){
        $this->get('/api/kommentar/2/kommentare/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Kommentar2_Kommentare.csv");
    }

    public function test_exportReference(){
        $this->get('/api/kommentar/2/referenz/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Kommentar2_Referenz_Paragraph99.csv");

        $this->get('/api/kommentar/17/referenz/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Kommentar17_Referenz_Kommentar2.csv");
    }
}
