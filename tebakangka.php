<?php

// Minta nama pemain
$name = readline("Halo, siapa namamu? ");

// Memberikan instruksi pada pemain
echo "Hai " . $name . ", Aku punya sebuah angka di antara 1 dan 20. Coba tebak ya!\n";

// Pilih angka acak dari 1 hingga 20
$number = rand(1, 20);

// Mulai loop permainan
for ($i = 1; $i <= 6; $i++) {
    // Minta tebakan pemain
    echo "Tebakanmu: ";
    $guess = readline();

    // Evaluasi tebakan
    if ($guess < $number) {
        echo "Terlalu rendah!\n";
    } elseif ($guess > $number) {
        echo "Terlalu tinggi!\n";
    } else {
        break;
    }
}

// Keluar dari loop permainan
if ($guess == $number) {
    echo "Bagus sekali, " . $name . "! Kamu menebak benar dengan " . $i . " kali tebakan.\n";
} else {
    echo "Maaf, kesempatanmu sudah habis. Angka yang aku pikirkan adalah " . $number . ".\n";
}

?>
