

function init() {
  var container = document.getElementById('map-div');

  /* Google Map options


  MapTypeId
  MapTypeId.ROADMAP displays the default road map view. This is the default map type.
  MapTypeId.SATELLITE displays Google Earth satellite images
  MapTypeId.HYBRID displays a mixture of normal and satellite views
  MapTypeId.TERRAIN displays a physical map based on terrain information.

  */

  var map = new google.maps.Map(container, {
    mapTypeControl: false,
    center: new google.maps.LatLng(37.0902, -95.7129),
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styles
  });

  // if you add renderertype:'Canvas' to the options for ThreejsLayer, you can force the usage of CanvasRenderer
  new ThreejsLayer({ map: map }, function(layer){
    
    // fallback to sprite if webgl not supported
    if (layer.renderertype=='Canvas' || !Detector.webgl) {
      texture = new THREE.Texture(generateSprite());
      particles = new THREE.Object3D();
      material = new THREE.SpriteMaterial({
        size: 20,
        map: texture,
        opacity: 1,
        blending: THREE.NormalBlending,
        depthTest: false,
        transparent: true
      });
      
      
      photos.forEach(function (photo) {
        var particle = new THREE.Sprite(material);
        var location = new google.maps.LatLng(photo[0], photo[1]),
          vertex = layer.fromLatLngToVertex(location);

        particle.position.set(vertex.x, vertex.y, 0);
        particle.scale.x = particle.scale.y = 20;
        particles.add(particle);
        material.size = 20;
      });
    } else {
    // render with webgl
    var geometry = new THREE.Geometry(),
      texture = new THREE.Texture(generateSprite()),
      material, particles;

    photos.forEach(function(photo){
      var location = new google.maps.LatLng(photo[0], photo[1]),
        vertex = layer.fromLatLngToVertex(location);

      geometry.vertices.push( vertex );
    });

    texture.needsUpdate = true;

    material = new THREE.ParticleBasicMaterial({
      size: 200,
      map: texture,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    particles = new THREE.ParticleSystem( geometry, material );
    }
    layer.add( particles );

    gui = new dat.GUI();

    function update(){
      if (layer.renderertype=='Canvas' || !Detector.webgl)  material.map = new THREE.Texture(generateSprite(material.size));
      layer.render();
    }

    gui.add(material, 'size', 2, 100).onChange(update);
    gui.add(material, 'opacity', 0.1, 1).onChange(update);

  });
}

// fallback to 2d if webgl not supported
function generateSprite(size) {
  var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    gradient;
  size = size || 200;
  canvas.width = size;
  canvas.height = size;

  gradient = context.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );

  gradient.addColorStop(1.0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.0, 'rgba(255,255,255,1)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}

document.addEventListener('DOMContentLoaded', init, false);


/* cube render */
/*
var camera;
var scene;
var renderer;
var mesh;
 
init();
animate();
 
function init() {
 
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000);
 
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 1 ).normalize();
    scene.add(light);
 
    var geometry = new THREE.CubeGeometry( 10, 10, 10);
    var material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
 
    mesh = new THREE.Mesh(geometry, material );
    mesh.position.z = -50;
    scene.add( mesh );
 
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    window.addEventListener( 'resize', onWindowResize, false );
 
    render();
}
 
function animate() {
    mesh.rotation.x += .04;
    mesh.rotation.y += .02;
 
    render();
    requestAnimationFrame( animate );
}
 
function render() {
    renderer.render( scene, camera );
}
 
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}
* */
