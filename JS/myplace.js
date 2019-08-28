new Maplace({
    map_div: '#gmap-fusion',
    type: 'fusion',
    map_options: {
        zoom: 2,
        set_center: [31.1, -39.4]
    },
    fusion_options: {
        query: {
            from: '423292',
            select: 'location'
        },
        heatmap: {
            enabled: true
        },
        suppressInfoWindows: true
    }
}).Load();