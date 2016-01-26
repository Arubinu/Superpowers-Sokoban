namespace Game.Map
{
  let current: Sup.TileMapRenderer;

  // Getters
  export function get(): Sup.TileMapRenderer
  {
    return ( current );
  }

  // Setters
  export function set( map: Sup.TileMapRenderer )
  {
    current = map;
  }

  // Methods
  export function init( map: Sup.TileMapRenderer )
  {
    set( map );
  }

  export function copy( to: Sup.TileMap, from: Sup.TileMap, position?: Sup.Math.XY )
  {
    let w = from.getWidth();
    let h = from.getHeight();

    if ( !position )
      position = { x: 0, y: 0 };

    for ( let y = 0; y < h; ++y )
    {
      for ( let x = 0; x < w; ++x )
      {
        to.setTileAt( 0, x + position.x, y + position.y, from.getTileAt( 0, x, y ) );
        to.setTileAt( 1, x + position.x, y + position.y, from.getTileAt( 1, x, y ) );
      }
    }
  }

  export function clear( map?: Sup.TileMap )
  {
    if ( !map )
      map = get().getTileMap();

    let w = map.getWidth();
    let h = map.getHeight();

    for ( let y = 0; y < h; ++y )
    {
      for ( let x = 0; x < w; ++x )
        map.setTileAt( 1, x, y, -1 ).setTileAt( 0, x, y, -1 );
    }
  }
}