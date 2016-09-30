'use babel';

export default class PsdExtractView {

	constructor(serializedState) {
		
		this.imageName = '';
		
		var self = this;
		
		// Create root element
		this.element = document.createElement('div');
		this.element.classList.add('psd-extract');

		this.pluginPath = atom.packages.getPackageDirPaths()[0] + '/psd-extract/';

		// create div with class
		this.cE = function( className ) {
			var el = document.createElement( 'div' );
				el.classList.add( className );
			return el;
		};

		// create div with id
		this.cEiD = function( id ) {
			var el = document.createElement( 'div' );
				el.setAttribute( 'id', id )
			return el;
		};
		
		this.resizer();
		
		var exporter = this.cE( 'exporter' );
		this.element.appendChild( exporter );

		this.preview = this.cEiD( 'preview' );
		exporter.appendChild( this.preview );
		
		this.inner = this.cE( 'inner' );
		this.preview.appendChild( this.inner );
		
		this.constrols();
		
		this.objects = this.cEiD( 'objects' );
		this.inner.appendChild( this.objects );
		
		this.importer = this.cEiD( 'importer' );
		this.importer.classList.add( 'active' );
		exporter.appendChild( this.importer );
		
		this.importer.addEventListener( 'drop', function( event ) {
			
			event.preventDefault();
			event.dataTransfer.dropEffect = "move";
			var data = event.dataTransfer.files[0];
			
			if ( data.type === "image/vnd.adobe.photoshop" ) {
				
				self.parseFile( data.path, function( Styles ) {
					
					self.showPreview( Styles );
				});
			}
			
			this.classList.remove( 'over' );
		});
		
		this.importer.addEventListener( 'dragover', function( event ) {
			
			event.preventDefault();
			this.classList.add( 'over' );
		});
		
		this.importer.addEventListener( 'dragleave', function( event ) {
			
			event.preventDefault();
			this.classList.remove( 'over' );
		});
	}
	
	resizer() {
		
		var self = this;
		var resizer = this.cE( 'resizer' );
		this.element.appendChild( resizer );
		
		var clicked = false;
		var startX = 0;
		
		var paneWidth = 0;
		
		resizer.addEventListener( 'mousedown', function( event ) {
			
			startX = event.clientX;
			clicked = true;
			paneWidth = self.element.offsetWidth;
		});
		
		window.addEventListener( 'mouseup', function() {
			
			clicked = false;
			paneWidth = self.element.offsetWidth;
		});
		
		window.addEventListener( 'mousemove', function( event ) {
			
			if ( clicked ) {
				self.element.style.width = (paneWidth+(startX-event.clientX)) + 'px';
			}
		});
	}
	
	constrols() {
		
		// load jquery
		var $ = jQuery = require('../assets/js/jquery-1.12.4.min.js');
		require('../assets/js/jquery-ui.min.js');

		var self = this;
		
		var controls = this.cE( 'controls' );
		var zoomIn = this.cE( 'zoom-in' );
		var zoomOut = this.cE( 'zoom-out' );
		var backBtn = this.cE( 'back' );
		
		var currentZoom = 100;
		
		jQuery( this.inner ).draggable({
			cancel : '.tooltip'
		});
		
		zoomIn.addEventListener( 'click', function() {
			
			currentZoom += 5;
			self.psdPreviewImage.style.zoom = currentZoom + "%";
		});
		
		zoomOut.addEventListener( 'click', function() {
			
			currentZoom -= 5;
			self.psdPreviewImage.style.zoom = currentZoom + "%";
		});
		
		backBtn.addEventListener( 'click', function() {
			
			self.preview.classList.remove( 'active' );
			self.importer.classList.add( 'active' );
		});
		
		controls.appendChild( zoomIn );
		controls.appendChild( zoomOut );
		controls.appendChild( backBtn );
		
		this.preview.appendChild( controls );
	}
	
	showPreview( Styles ) {
		
		var self = this;
		var remote = require('remote');
			
		if ( typeof this.psdPreviewImage !== 'undefined' ) {
			
			this.psdPreviewImage.remove();
		}
		
		this.psdPreviewImage = new Image();
		
		this.inner.appendChild( this.psdPreviewImage );
		
		// later we will do some layers preview
		var layers = this.cEiD( 'layers' );
		
		this.psdPreviewImage.onload = function() {
			
			self.preview.classList.add( 'active' );
			self.importer.classList.remove( 'active' );
			self.createObjects( Styles );
		};
		
		this.psdPreviewImage.src = this.pluginPath + './data/' + this.imageName;
	}
	
	createNotification() {
		
		this.notification = this.cE( 'tooltip' );
		this.notification.classList.add( 'native-key-bindings' );
		this.notification.setAttribute( 'tabindex', -1 );
		
		this.notification.name = this.cE( 't-name' );
		this.notification.appendChild( this.notification.name );
		
		this.notification.text = this.cE( 't-text' );
		this.notification.appendChild( this.notification.text );
		
		this.notification.blendingMode = this.cE( 't-blendig-mode' );
		this.notification.appendChild( this.notification.blendingMode );
		
		this.notification.width = this.cE( 't-width' );
		this.notification.appendChild( this.notification.width );
		
		this.notification.height = this.cE( 't-height' );
		this.notification.appendChild( this.notification.height );
		
		this.notification.top = this.cE( 't-top' );
		this.notification.appendChild( this.notification.top );
		
		this.notification.left = this.cE( 't-left' );
		this.notification.appendChild( this.notification.left );
		
		this.notification.opacity = this.cE( 't-opacity' );
		this.notification.appendChild( this.notification.opacity );
		
		this.notification.backgroundColor = this.cE( 't-background-color' );
		this.notification.appendChild( this.notification.backgroundColor );
		
		// this.notification.backgroundColorPreview = this.cE( 't-color-preview' );
		// this.notification.backgroundColor.appendChild( this.notification.backgroundColorPreview );
		
		this.notification.linearGradient = this.cE( 't-linear-backround' );
		this.notification.appendChild( this.notification.linearGradient );
		
		this.notification.boxShadow = this.cE( 't-box-shadow' );
		this.notification.appendChild( this.notification.boxShadow );
		
		this.notification.border = this.cE( 't-border' );
		this.notification.appendChild( this.notification.border );
		
		this.notification.borderRadius = this.cE( 't-border-badius' );
		this.notification.appendChild( this.notification.borderRadius );
		
		this.notification.fontFamily = this.cE( 't-font-family' );
		this.notification.appendChild( this.notification.fontFamily );
		
		this.notification.fontSize = this.cE( 't-font-size' );
		this.notification.appendChild( this.notification.fontSize );
		
		this.notification.fontWeight = this.cE( 't-font-weight' );
		this.notification.appendChild( this.notification.fontWeight );
		
		this.notification.lineHeight = this.cE( 't-line-height' );
		this.notification.appendChild( this.notification.lineHeight );
		
		this.notification.textShadow = this.cE( 't-text-shadow' );
		this.notification.appendChild( this.notification.textShadow );
		
		this.notification.textTransform = this.cE( 't-text-transform' );
		this.notification.appendChild( this.notification.textTransform );
		
		this.notification.color = this.cE( 't-color' );
		this.notification.appendChild( this.notification.color );
		
		this.notification.backgroundColorPreview = this.cE( 't-color-preview' );
		this.notification.appendChild( this.notification.backgroundColorPreview );
		
		
		this.objects.appendChild( this.notification );
	}

	createObjects( Styles ) {
		
		var self = this;
		var psdWidth = this.psdPreviewImage.naturalWidth;
		var psdHeight = this.psdPreviewImage.naturalHeight;

		var toPercentageX = function( pixels ) {

			var percentage = pixels*100/psdWidth;

			var koffW = self.psdPreviewImage.clientWidth/psdWidth;

			return percentage;
		};

		var toPercentageY = function( pixels ) {

			var percentage = pixels*100/psdHeight;
			var koffH = self.psdPreviewImage.clientHeight/psdHeight;

			return percentage;
		};
		
		// metodas skirtas susikurti objekta
		var createObject = function( data, appendTo ) {
			
			var obj = document.createElement( 'div' );
				obj.classList.add( 'obj' );
				
				obj.style.width = toPercentageX( data['node'].width ) + "%";
				obj.style.height = toPercentageY( data['node'].height ) + "%";
				obj.style.top = toPercentageY( data['node'].top ) + "%";
				obj.style.left = toPercentageX( data['node'].left ) + "%";
				
				obj.setAttribute( 'data-object', JSON.stringify( data ) );
				
				obj.addEventListener( 'click', handleObjClick );
			
			return obj;
		};
		
		var createGroup = function( data ) {
			
			var group = document.createElement( 'div' );
				group.classList.add( 'group' );
				
			
			return group;
		};
		
		var constructRGBa = function( color, alpha ) {
			
			if ( typeof alpha !== 'undefined' ) {
				
				var color = 'rgba(' + Math.round( color["Rd  "] ) + ', ' + Math.round( color["Grn "] ) + ', ' + Math.round( color["Bl  "] ) + ', ' + alpha + ')';
			} else {
				
				var color = 'rgb(' + Math.round( color["Rd  "] ) + ', ' + Math.round( color["Grn "] ) + ', ' + Math.round( color["Bl  "] ) + ')';
			}
			
			return color;
		};
		
		var handleObjClick = function() {
			
			var data = JSON.parse( this.getAttribute( 'data-object' ) )
			
			var layerStyles = {
				blendingMode: data.node.blendingMode,
				width: data.node.width,
				height: data.node.height,
				top: data.node.top,
				left: data.node.left,
				opacity: data.node.opacity,
				name: data.node.name,
			};
			
			
			/**
			 * Susidedam borderius
			 */
			if ( typeof data['vectorStroke'] !== 'undefined' ) {
				
				var curr = data['vectorStroke'];
				var color = constructRGBa( curr.strokeStyleContent["Clr "], curr.strokeStyleOpacity.value/100 );
				var width = curr.strokeStyleLineWidth.value;
				
				var border = width + 'px solid ' + color;
				
				layerStyles.border = border;
			}
			
			/**
			 * Susidedam border-radius
			 */
			if ( typeof data['vectorOrigination'] !== 'undefined' ) {
				
				var curr = data['vectorOrigination']['keyDescriptorList'][0]['keyOriginRRectRadii'];
				
				if ( typeof curr !== 'undefined' ) {
					
					var bdrd = [];
					
					bdrd.push( Math.round( curr.topLeft.value ) );
					bdrd.push( Math.round( curr.topRight.value ) );
					bdrd.push( Math.round( curr.bottomLeft.value ) );
					bdrd.push( Math.round( curr.bottomRight.value ) );
					
					var results = bdrd.map(function( item, index ){
						
						return item === bdrd[0];
					});
					
					if ( results.length === 4 ) {
						
						var borderRadius = bdrd[0] + 'px';
					} else {
						
						var borderRadius = bdrd.join( 'px ' );
					}
					
					layerStyles.borderRadius = borderRadius;
				}
			}
			
			/**
			 * Susidedam teksto stilius
			 */
			if ( typeof data['typeTool'] !== 'undefined' &&  typeof data['node'].text !== 'undefined' ) {
				
				var font = data['node'].text.font;
				var fontFamily = font.name;
				
				var colors = font.colors[0].pop();
				var color = 'rgb(' + font.colors[0].join( ', ' ) + ')';
				
				var transY = data['node'].text.transform.yy;
				
				var fontSize = font.sizes[0];
				var lineHeight = data['typeTool'].Leading[0];
				
				fontSize = Math.round((fontSize * transY) * 100) * 0.01;
				lineHeight = Math.round((lineHeight * transY) * 100) * 0.01;
				
				var fontWeightNames = {
					"thin": 100,
					"extralight": 200,
					"ultralight": 200,
					"light": 300,
					"book": 400,
					"normal": 400,
					"regular": 400,
					"roman": 400,
					"medium": 500,
					"semibold": 600,
					"demibold": 600,
					"bold": 700,
					"extrabold": 800,
					"ultrabold": 800,
					"black": 900,
					"heavy": 900
				};
				
				var ff = fontFamily.split('-');
				
				var fontWeight = fontWeightNames[ff[ff.length-1].toLowerCase()];
				
				if ( typeof fontWeight !== 'undefined' ) {
					
					ff.pop();
				}
				
				var textStyles = {
					fontFamily: ff.join( ' ' ),
					color: color,
					fontSize: fontSize,
					lineHeight: lineHeight,
					text: data['node'].text.value.replace(/\n/g, " ")
				};
				
				if ( typeof fontWeight !== 'undefined' ) {
					
					textStyles.fontWeight = fontWeight;
				}
				
				// text-transform - uppercase
				var fontCaps = data['typeTool'].FontCaps;
				if ( typeof fontCaps !== 'undefined' && fontCaps[0] === 2 ) {
					
					textStyles.textTransform = 'uppercase';
				}
				
				var layerStyles = Object.assign( layerStyles, textStyles );
			}
			
			if ( typeof data['objectEffects'] !== 'undefined' ) {
				
				var layerStyles = Object.assign( layerStyles, parseObjectEffects( data['objectEffects'] ) );
				
				if ( typeof data['node'].text !== 'undefined' && typeof layerStyles.dropShadow !== 'undefined' ) {
					
					layerStyles.textShadow = layerStyles.dropShadow;
				} else if ( typeof layerStyles.dropShadow !== 'undefined' ) {
					
					layerStyles.boxShadow = layerStyles.dropShadow;
				}
				
				delete layerStyles.dropShadow;
			}
			
			if ( typeof data['solidColor'] !== 'undefined' ) {
				
				var backgroundColor = 'rgb(' + data['solidColor'].join( ', ' ) + ')';
				
				layerStyles.backgroundColor = backgroundColor;
			}
			
			layerStyles.tooltipX = this.offsetLeft;
			layerStyles.tooltipY = this.offsetTop;
			
			self.updateNotification( layerStyles );
		};
		
		
		/**
		 * Susidam ivairius efektus
		 * Ju gal bus daugiau, bet dabar pagrinde dropShadow ir gradient
		 */
		var parseObjectEffects = function( objectEffects ) {
			
			var response = {};
			
			// drop shadow
			var ds = objectEffects['DrSh'];
			if ( typeof ds !== 'undefined' ) {
				
				var color = constructRGBa( ds["Clr "], (ds['Opct'].value/100) );
				
				var angle = ds['lagl'].value;
				var distance = ds['Dstn'].value;
				
				var x = distance * Math.cos( angle );
				var y = distance * Math.sin( angle );
				
				var dropShadow = x + 'px ' + y + 'px ' + ds['blur'].value + 'px ' + ds['Ckmt'].value + 'px ' + color;
				
				response.dropShadow = dropShadow;
			}
			
			// bandom issiparsingti gradienta
			// jeigu pavyks, busiu herojus :D
			var gf = objectEffects['GrFl'];
			if ( typeof gf !== 'undefined' ) {
				
				// background: linear-gradient(direction, color-stop1, color-stop2, ...);
				var angle = gf['Angl'].value + 90;
				
				var stops = [];
				
				for (var i = 0; i < gf['Grad']['Clrs'].length; i++) {
					
					var curr = gf['Grad']['Clrs'][i];
					var currTrns = gf['Grad']['Trns'][i];
					
					// console.log( currTrns['Opct'].value/100 );
					
					var color = constructRGBa( curr["Clr "], currTrns['Opct'].value/100 );
					stops.push( color );
				}
				
				var stopsStrin = stops.join( ', ' );
				var linearGradient = 'linear-gradient(' + angle + 'deg ' + ', ' + stopsStrin + ')';
				
				response.linearGradient = linearGradient;
			}
			
			return response;
		};

		// zygiuojam per duomenis ir juos dedames :)
		var processData = function( data, appendTo ) {

			for (var i = data.length-1; i > 0; i-- ) {
				
				// console.log( data[i] );
				
				if ( data[i]['node'].type === 'layer' ) {
					
					// jeigu layer, reikia susideti viska i reikiamas vietas
					
					var obj = createObject( data[i] );
					appendTo.appendChild( obj );
					
				} else if ( data[i]['node'].type === 'group' ) {
					
					// var group = createGroup();
					// appendTo.appendChild( group );
					
					// jeigu group, reikia iteruoti per naujo per grupe
					// bei susideti tuos elementus i atskira grupe
					// processData( data[i]['node'].children, group );
				}
			}
		};
		
		// issivalom
		this.objects.innerHTML = '';
		this.createNotification();
		
		processData( Styles, this.objects );
	}
	
	parseFile( pathToFile, cb ) {
		
		var fs = require( 'fs' );
		var self = this;
		
		var PSD = require('psd');
		var fs = require('fs');
		var psd = PSD.fromFile(pathToFile);
		psd.parse();

		var tree = psd.tree();
		
		var extractedData = [];

		psd.tree().descendants().forEach(function(node) {
			
			var nodeStyles = {};
			
			nodeStyles['node'] = node.export();
			
			// fill opacity
			// reikia patestuoti
			var fillOpacity = node.get( 'fillOpacity' );
			if ( typeof fillOpacity !== 'undefined' ) {
				
			}

			// shapeai
			var vectorOrigination = node.get( 'vectorOrigination' );
			if ( typeof vectorOrigination !== 'undefined' ) {

				vectorOrigination.data;
				// console.log( node.get('name') );
				// console.log( vectorOrigination.export() );
				nodeStyles['vectorOrigination'] = vectorOrigination.data;
			}


			// maskes vektorines
			// bbz ar mums to reikia
			var vectorMask = node.get( 'vectorMask' );
			if ( typeof vectorMask !== 'undefined' ) {

				vectorMask.invert;
				nodeStyles['vectorMask'] = vectorMask.export();
			}

			// su situo reikes padirebeti, nes cia daug geros info
			var objectEffects = node.get( 'objectEffects' );
			if ( typeof objectEffects !== 'undefined' ) {

				objectEffects.data;
				nodeStyles['objectEffects'] = objectEffects.data;
			}

			// pasitikrinam ar turi maske
			var layers = node.clippingMask();
			if ( node.layer.clipped ) {

				
			}
			
			// bandom isgauti stroke
			var vectorStroke = node.get( 'vectorStroke' );
			if ( typeof vectorStroke !== 'undefined' ) {

				vectorStroke.data;
				nodeStyles['vectorStroke'] = vectorStroke.data;
			}
			
			// bandom isgauti stroke
			var vectorStrokeContent = node.get( 'vectorStrokeContent' );
			if ( typeof vectorStrokeContent !== 'undefined' ) {

				vectorStrokeContent.data;
				nodeStyles['vectorStrokeContent'] = vectorStrokeContent.data;
			}
			
			// pasiimam visus teksto stilius
			var typeTool = node.get( 'typeTool' );
			if ( typeof typeTool !== 'undefined' ) {

				typeTool.export();
				nodeStyles['typeTool'] = typeTool.styles();
			}

			// pasiimam background spalve
			var solidColor = node.get('solidColor');
			if ( typeof solidColor !== 'undefined' ) {

				solidColor.color;
				nodeStyles['solidColor'] = solidColor.color();
			}
			
			extractedData.push( nodeStyles );
		});

		self.imageName = new Date().getTime() + '.png';
		
		
		var createImage = function() {
			
			PSD.open(pathToFile).then(function (psd) {

				return psd.image.saveAsPng( self.pluginPath + './data/' + self.imageName );
			}).then(function () {
				
				if ( typeof cb === 'function' ) {
					cb( extractedData );
				}
			});
		};
		
		fs.readdir( self.pluginPath + './data/' , function (err, files) {
			
			if ( typeof files !== 'undefined' && typeof files[0] !== 'undefined' ) {
				
				fs.unlink( self.pluginPath + './data/' + files[0] , function() {
					
					createImage();
				});
			} else {
				
				createImage();
			}
			
		});
	}

	// Returns an object that can be retrieved when package is activated
	serialize() {}

	// Tear down any state and detach
	destroy() {
		this.element.remove();
	}

	getElement() {
		return this.element;
	}
	
	
	updateNotification( data ) {
		
		this.notification.style.top = (data.tooltipY ) + 'px';
		this.notification.style.left = ( data.tooltipX + data.width*0.5 ) + 'px';
		
		var actprops = this.notification.querySelectorAll( '.active' );
		
		for (var i = 0; i < actprops.length; i++) {
			
			actprops[i].classList.remove( 'active' );
		}
		
		var rulesTexts = {
			blendingMode: {
				prefix: 'Blending mode: ',
				suffix: ''
			},
			width: {
				prefix: 'width: ',
				suffix: 'px;'
			},
			height: {
				prefix: 'height: ',
				suffix: 'px;'
			},
			top: {
				prefix: 'top: ',
				suffix: 'px;'
			},
			left: {
				prefix: 'left: ',
				suffix: 'px;'
			},
			opacity: {
				prefix: 'opacity: ',
				suffix: ';'
			},
			name: {
				prefix: 'Layer name: ',
				suffix: ''
			},
			fontFamily: {
				prefix: 'font-family: ',
				suffix: ';'
			},
			color: {
				prefix: 'color: ',
				suffix: ';'
			},
			fontSize: {
				prefix: 'font-size: ',
				suffix: 'px;'
			},
			lineHeight: {
				prefix: 'line-height: ',
				suffix: 'px;'
			},
			textShadow: {
				prefix: 'text-shadow: ',
				suffix: ';'
			},
			text: {
				prefix: 'Text: ',
				suffix: ''
			},
			backgroundColor: {
				prefix: 'background-color: ',
				suffix: ';'
			},
			linearGradient: {
				prefix: 'linear-gradient: ',
				suffix: ';'
			},
			boxShadow: {
				prefix: 'box-shadow: ',
				suffix: ';'
			},
			border: {
				prefix: 'border: ',
				suffix: ';'
			},
			borderRadius: {
				prefix: 'border-radius: ',
				suffix: ';'
			},
			textTransform: {
				prefix: 'text-transform: ',
				suffix: ';'
			},
			fontWeight: {
				prefix: 'font-weight: ',
				suffix: ';'
			}
		};
		
		for ( var prop in data ) {
			
			if ( typeof this.notification[prop] !== 'undefined' ) {
				
				if ( typeof rulesTexts[prop] !== 'undefined' ) {
					
					this.notification[prop].innerHTML = rulesTexts[prop].prefix + data[prop] + rulesTexts[prop].suffix;
				} else {
					
					this.notification[prop].innerHTML = data[prop];
				}
			
				this.notification[prop].classList.add( 'active' );
			}
		}
		
	}

}
