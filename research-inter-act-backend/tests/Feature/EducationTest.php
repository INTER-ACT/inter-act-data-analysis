<?php

namespace Tests\Feature;

use App\Education;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EducationTest extends TestCase
{
    use WithoutMiddleware;

    public function test_index(){
        $this->get('/api/ausbildungen')
            ->assertOk()
            ->assertJsonCount(Education::all()->count())
            ->assertJsonStructure([[
                "ausbildungs_id",
                "ausbildung"
            ]]);
    }

    public function test_show(){
        $education=Education::find(1);
        $this->get('/api/ausbildung/1')
            ->assertOk()
            ->assertJson([
                "ausbildungs_id"=>$education->ausbildungs_id,
                "ausbildung"=>$education->ausbildung
            ]);
    }
}
