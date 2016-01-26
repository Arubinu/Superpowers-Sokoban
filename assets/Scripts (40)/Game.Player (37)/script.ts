namespace Game.Player
{
  export function position()
  {
    let map = Game.Map.get().getTileMap()
    let w = map.getWidth();
    let h = map.getHeight();

    for ( let y = 0; y < h; ++y )
    {
      for ( let x = 0; x < w; ++x )
      {
        if ( map.getTileAt( 1, x, y ) == 2 )
          return ( { x: x, y: y } );
      }
    }

    return ( { x: -1, y: -1 } );
  }

  export function move( move: Sup.Math.XY )
  {
    let ok = true;
    let player = Game.Player.position();
    let map = Game.Map.get().getTileMap()
    let check = map.getTileAt( 1, player.x + move.x, player.y + move.y );

    if ( check == 3 )
    {
      check = map.getTileAt( 1, player.x + ( move.x * 2 ), player.y + ( move.y * 2 ) );

      if ( check == -1 )
      {
        map.setTileAt( 1, player.x + ( move.x * 2 ), player.y + ( move.y * 2 ), 3 );
        map.setTileAt( 1, player.x + move.x, player.y + move.y, 2 );
      }
      else
        ok = false;
    }
    else if ( check == -1 )
      map.setTileAt( 1, player.x + move.x, player.y + move.y, 2 );
    else
      ok = false;

    if ( ok )
      map.setTileAt( 1, player.x, player.y, -1 );
  }
}