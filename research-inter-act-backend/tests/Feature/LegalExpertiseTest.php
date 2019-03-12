<?php

namespace Tests\Feature;

use App\LegalExpertise;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LegalExpertiseTest extends TestCase
{
    use WithoutMiddleware;

    public function test_index(){
        $this->get('/api/rechtskenntnisse')
            ->assertOk()
            ->assertJsonCount(LegalExpertise::all()->count())
            ->assertJsonStructure([[
                "rechtskenntnis_id",
                "rechtskenntnis"
            ]]);
    }

    public function test_show(){
        $legalExpertise=LegalExpertise::find(1);
        $this->get('/api/rechtskenntniss/1')
            ->assertOk()
            ->assertJson([
                "rechtskenntnis_id"=>$legalExpertise->rechtskenntnis_id,
                "rechtskenntnis"=>$legalExpertise->rechtskenntnis
            ]);
    }
}
