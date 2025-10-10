<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    protected $fillable = [
        "code",
        "name",
        "unit_of_measurement",
        "medium_price",
    ];

    protected $casts = [
        "medium_price" => "decimal:2",
    ];
}
