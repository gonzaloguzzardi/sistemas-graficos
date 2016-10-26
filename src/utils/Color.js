function getColor(color) 
{
    if (color == "red") return [1.0, 0.0, 0.0];
    if (color == "green") return [0.0, 1.0, 0.0];
    if (color == "blue") return [0.0, 0.0, 1.0];
    if (color == "black") return [0.0, 0.0, 0.0];
    if (color == "white") return [1.0, 1.0, 1.0];
    if (color == "yellow") return [1.0, 1.0, 0.0];


    //geometry specific
    if (color == "towerBase") return [0.715, 0.1, 0.1];
    if (color == "towerTop") return [0.59, 0.22, 0.22];
    if (color == "mainCables") return [0.915, 0.1, 0.1];
    if (color == "strap") return [0.915, 0.1, 0.1];
    if (color == "road") return [0.92, 0.92, 0.92];

    //Color desconocido
    return [0.5, 0.5, 0.5];
}