<?php

namespace Tests\Feature;

use App\Statistic;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StatisticTest extends TestCase
{
    use WithoutMiddleware;

    public function test_index(){
        $this->get('/api/statistiken')
            ->assertOk()
            ->assertJsonCount(Statistic::all()->count())
            ->assertJsonStructure([[
                "statistik_id",
                "gesetzes_id",
                "user_id",
                "link_ort",
                "datum"
            ]]);
    }

    public function test_show(){
        $statistic=Statistic::find(1);
        $this->get('/api/statistik/1')
            ->assertOk()
            ->assertJson([
                "statistik_id"=>$statistic->statistik_id,
                "gesetzes_id"=>$statistic->gesetzes_id,
                "user_id"=>$statistic->user_id,
                "link_ort"=>$statistic->link_ort,
                "datum"=>$statistic->datum
            ]);
    }

    public function test_store(){
        $data = [
            'gesetzes_id' => 1,
            'user_id' => 5,
            'link_ort' => 'w',
        ];
        $this->post('/api/statistik',$data)
            ->assertStatus(201);
    }
}
