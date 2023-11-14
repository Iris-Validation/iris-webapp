function generate_circle(diameter, canvas) {
    canvas.circle(diameter)
        .center(0, 0)
        .fill('none')
        .stroke({
        width: 0.5,
        color: 'white'
    });
}
function generate_test_ring(diameter, amplitude, canvas) {
    const radius = diameter / 2;
    const norm1 = generate_test_data(360, amplitude);
    // generate_circle(diameter, canvas)
    const pl = calculate_poly_line(radius, norm1);
    const ring = calculate_poly_line_for_circle(radius);
    const points = pl + ring;
    console.log(points);
    canvas.polyline(points)
        .fill('blue')
        .stroke({
        width: 0.5,
        color: 'red'
    })
        .attr({
        'fill-rule': 'evenodd'
    });
}
function generate_ring(diameter, data, canvas) {
    const radius = diameter / 2;
    const norm1 = normalise_data(data);
    // generate_circle(diameter, canvas)
    const pl = calculate_poly_line(radius, norm1);
    const ring = calculate_poly_line_for_circle(radius);
    const points = pl + ring;
    canvas.polyline(points)
        .fill('blue')
        .stroke({
        width: 0.5,
        color: 'red'
    })
        .attr({
        'fill-rule': 'evenodd'
    });
}
