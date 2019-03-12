<?php

use App\Student;
use Illuminate\Database\Seeder;

class StudentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Student::truncate();

        $faker = \Faker\Factory::create();


        for ($i=0; $i < 50; $i++) { 
        	Student::create([
        		'name' => $faker->name,
        		'description' => $faker->text
        	]);
        }

    }
}
