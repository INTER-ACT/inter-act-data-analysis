<?php

namespace Tests\Feature;

use App\Rating;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RatingTest extends TestCase
{
    use WithoutMiddleware;


    public function test_index()
    {
        $this->get('/api/ratings')
            ->assertOk()
            ->assertJsonCount(Rating::all()->count())
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

    public function test_show(){
        $rating=Rating::find(1);
        $this->get('/api/rating/1')
            ->assertOk()
            ->assertJson([
                "rating_id"=>$rating->rating_id,
                "user_id"=>$rating->user_id,
                "typ"=>$rating->typ,
                "aspect"=>$rating->aspect,
                "wertung"=>$rating->wertung,
                "rating_bezugs_id"=>$rating->rating_bezugs_id,
                "datum"=>$rating->datum,
                "ip"=>$rating->ip
            ]);
    }

    public function test_esport(){
        $this->get('/api/ratings/csv')
            ->assertOk()
            ->assertHeader("Content-Disposition","attachment; filename=Ratings.csv");
    }
}
