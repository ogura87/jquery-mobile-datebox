/* jQuery-Mobile-DateBox */

/*! SLIDEBOX Mode */

(function($) {
	$.extend( $.mobile.datebox.prototype.options, {
		themeDateHigh: "b",
		themeDatePick: "b",
		themeDate: "a",
		useSetButton: true,
		validHours: false,
		slen: {
			"y": 5, 
			"m": 6, 
			"d": 15, 
			"h": 12, 
			"i":30
		}
	});
	$.extend( $.mobile.datebox.prototype, {
		"_sbox_pos": function () {
			var fixer, ech, top, par, tot,
				w = this;
			
			w.d.intHTML.find( "div.ui-datebox-sliderow-int" ).each(function () {
				ech = $(this);
				par = ech.parent().outerWidth();
				
				if ( w.__( "isRTL" ) ) { 
					top = ech.find("div").last(); 
				} else {
					top = ech.find("div").first();
				}
				
				tot = ech.find( "div" ).size() * top.outerWidth();
				
				fixer = ech.outerWidth();
				
				if ( fixer > 0 ) { tot = fixer; }
				
				top.css( "marginLeft", ( tot - par ) / 2 * -1 );
			});
		}
	});
	$.extend( $.mobile.datebox.prototype._build, {
		"slidebox": function () {
			var i, y, hRow, phRow, tmp, testDate,
				w = this,
				o = this.options,
				g = this.drag,
				iDate = (w.d.input.val() === "") ?
					w._startOffset( w._makeDate( w.d.input.val() ) ) :
					w._makeDate(w.d.input.val()
				),
				uid = "ui-datebox-",
				slideBase = $( "<div class='"+uid+"sliderow-int'></div>" ),
				phBase = $( "<div>" ),
				ctrl = $( "<div>", { "class": uid + "slide" } );
			
			if ( typeof w.d.intHTML !== "boolean" ) {
				w.d.intHTML.remove().empty();
			} else {
				w.d.input.on( "datebox", function (e,p) {
					if ( p.method === "postrefresh" ) { w._sbox_pos(); }
				});
			}
			
			w.d.headerText = ( (w._grabLabel() !== false ) ?
				w._grabLabel() : 
				w.__( "titleDateDialogLabel")
			);
			w.d.intHTML = $( "<span class='" + uid + "nopad'>" );
			
			w.fldOrder = w.__( "slideFieldOrder" );
			w._check();
			w._minStepFix();
			
			$("<div class='" + uid + "header'><h4>" +
					w._formatter(w.__( "headerFormat" ), w.theDate) + "</h4></div>")
				.appendTo(w.d.intHTML);
			
			w.d.intHTML.append(ctrl);
			
			for ( y=0; y<w.fldOrder.length; y++ ) {
				phRow = phBase
					.clone()
					.data( "rowtype", w.fldOrder[y]);
				
				hRow = slideBase
					.clone()
					.data( "rowtype", w.fldOrder[y])
					.appendTo(phRow);
					
				if ( w.__( "isRTL" ) === true ) { hRow.css( "direction", "rtl" ); }
				
				switch (w.fldOrder[y]) {
					case "y":
						phRow.addClass( uid + "sliderow " + uid + "sliderow-ym" );
						for ( i = o.slen.y * -1; i < ( o.slen.y + 1 ); i++ ) {
							tmp = ( i !== 0 ) ?
								( ( iDate.get(0) === (w.theDate.get(0) + i) ) ?
									o.themeDateHigh :
									o.themeDate
								) :
								o.themeDatePick;
							$( "<div>", { 
									"class": uid + "slidebox " + uid +
										"slideyear ui-btn ui-btn-" + tmp
								} )
								.text( w.theDate.get(0)+i )
								.data( "offset", i )
								.appendTo( hRow );
						}
						break;
					case "m":
						phRow.addClass( uid + "sliderow " + uid + "sliderow-ym" );
						for ( i = o.slen.m * -1; i < ( o.slen.m + 1 ); i++ ) {
							testDate = w.theDate.copy([0],[0,0,1]);
							testDate.adj( 1, i );
							tmp = ( i !== 0 ) ?
								( ( iDate.get(1) === testDate.get(1) &&
										iDate.get(0) === testDate.get(0) ) ?
									o.themeDateHigh :
									o.themeDate
								) :
								o.themeDatePick;
							$( "<div>", { 
									"class": uid + "slidebox " + uid +
										"slidemonth ui-btn ui-btn-" + tmp }
								)
								.text( String(w.__( "monthsOfYearShort" )[testDate.get(1)]) )
								.data( "offset", i )
								.appendTo( hRow );
						}
						break;
						
					case "d":
						phRow.addClass( uid + "sliderow " + uid + "sliderow-d" );
						for ( i = o.slen.d * -1; i < ( o.slen.d + 1 ); i++ ) {
							testDate = w.theDate.copy();
							testDate.adj( 2, i );
							tmp = ( i !== 0 ) ?
								( ( iDate.comp() === testDate.comp() ) ?
									o.themeDateHigh :
									o.themeDate
								) :
								o.themeDatePick;
							if ( ( $.inArray(testDate.iso(), o.blackDates) > -1 ||
									$.inArray(testDate.getDay(), o.blackDays) > -1 ) &&
									( $.inArray(testDate.iso(), o.whiteDates) < 0 ) ) { 
								tmp += " ui-state-disabled"; }
							
							$( "<div>", { 
									"class": uid + "slidebox " + uid +
										"slideday ui-btn ui-btn-" + tmp }
								)
								.html( 
									testDate.get(2) + "<br /><span class='" + uid + "slidewday'>" +
									w.__( "daysOfWeekShort" )[testDate.getDay()] + "</span>"
								)
								.data( "offset", i )
								.appendTo( hRow );
						}
						break;
					case "h":
						phRow.addClass( uid + "sliderow " + uid + "sliderow-hi" );
						for ( i = o.slen.h * -1; i < ( o.slen.h + 1 ); i++ ) {
							testDate = w.theDate.copy();
							testDate.adj( 3, i );
							tmp = ( i !== 0 ) ?
								o.themeDate :
								o.themeDatePick;
							if ( o.validHours !== false &&
									$.inArray( testDate.get(3), o.validHours ) < 0
								) {
								tmp += " ui-state-disabled";
							}
							$( "<div>", { 
									"class": uid + "slidebox " + uid +
										"slidehour ui-btn ui-btn-" + tmp }
								)
								.html( w.__( "timeFormat" ) === 12 ?
									w._formatter(
										"%-I<span class='" + uid + "slidewday'>%p</span>",
										testDate
									) :
									testDate.get(3)
								)
								.data( "offset", i )
								.appendTo( hRow );
						}
						break;
					case "i":
						phRow.addClass( uid + "sliderow " + uid + "sliderow-hi" );
						for ( i = o.slen.i * -1; i < ( o.slen.i + 1 ); i++ ) {
							testDate = w.theDate.copy();
							testDate.adj( 4, ( i * o.minuteStep ) );
							tmp = ( i !== 0 ) ?
								o.themeDate :
								o.themeDatePick;
							$( "<div>", {
									"class": uid + "slidebox " + uid +
									"slidemins ui-btn ui-btn-" + tmp }
								)
								.text( w._zPad( testDate.get(4) ) )
								.data( "offset", i * o.minuteStep )
								.appendTo( hRow );
						}
						break;
				}
				phRow.appendTo(ctrl);
			}
			
			if ( o.useSetButton || o.useClearButton ) {
				y = $( "<div>", { "class": uid + "controls " + uid + "repad" } );
				
				if ( o.useSetButton ) {
					$( "<a href='#' role='button'>" )
						.appendTo(y)
						.text(w.__( "setDateButtonLabel" ))
						.addClass(
							"ui-btn ui-btn-" + o.theme + 
							" ui-icon-check ui-btn-icon-left ui-shadow ui-corner-all"
						)
						.on(o.clickEventAlt, function(e) {
							e.preventDefault();
							if ( w.dateOK === true ) {
								w._t( { 
									method: "set", 
									value: w._formatter(w.__fmt(),w.theDate),
									date: w.theDate
								} );
								w._t( { method: "close" } );
							}
							
						});
				}
				if ( o.useClearButton ) {
					$( "<a href='#' role='button'>" + w.__( "clearButton" ) + "</a>" )
						.appendTo(y)
						.addClass( 
							"ui-btn ui-btn-" + o.theme +
							" ui-icon-delete ui-btn-icon-left ui-shadow ui-corner-all"
						)
						.on(o.clickEventAlt, function(e) {
							e.preventDefault();
							w.d.input.val("");
							w._t( { method: "clear" } );
							w._t( { method: "close" } );
						});
				}
				if ( o.useCollapsedBut ) {
					y.addClass( "ui-datebox-collapse" );
				}
				y.appendTo(w.d.intHTML);
			}
			
			if ( w.wheelExists ) { // Mousewheel operation, if plugin is loaded
				w.d.intHTML.on( "mousewheel", ".ui-datebox-sliderow-int", function(e,d) {
					e.preventDefault();
					w._offset(
						$( this ).data( "rowtype" ),
						(( d<0 ) ? -1 : 1 ) * ( $(this).data( "rowtype" )==="i" ? o.minuteStep : 1 )
					);
				});
			}
			
			w.d.intHTML.on( o.clickEvent, ".ui-datebox-sliderow-int>div", function(e) {
				e.preventDefault();
				w._offset(
					$(this).parent().data( "rowtype" ),
					parseInt( $(this).data( "offset" ),10 )
				);
			});
			
			w.d.intHTML.on( g.eStart, ".ui-datebox-sliderow-int", function(e) {
				if ( !g.move ) {
					g.move = true;
					g.target = $(this);
					g.pos = parseInt(g.target.css( "marginLeft" ).replace(/px/i, ""),10);
					g.start = w.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX;
					g.end = false;
					e.stopPropagation();
					e.preventDefault();
				}
			});
		}
	});
	$.extend( $.mobile.datebox.prototype._drag, {
		"slidebox": function() {
			var w = this,
				o = this.options,
				g = this.drag;
			
			$(document).on(g.eMove, function(e) {
				if ( g.move && o.mode === "slidebox") {
					g.end = w.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX;
					g.target.css( "marginLeft", (g.pos + g.end - g.start) + "px" );
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			});
			
			$(document).on(g.eEnd, function(e) {
				if ( g.move && o.mode === "slidebox" ) {
					g.move = false;
					if ( g.end !== false ) {
						e.preventDefault();
						e.stopPropagation();
						g.tmp = g.target.find( "div" ).first();
						w._offset(
							g.target.data("rowtype"),
							( w.__("isRTL") ? -1 : 1 ) * 
								(parseInt((g.start - g.end) / g.tmp.innerWidth(),10)) *
								(g.target.data( "rowtype") === "i" ? o.minuteStep : 1)
						);
					}
					g.start = false;
					g.end = false;
				}
			});
		}
	});
})( jQuery );
