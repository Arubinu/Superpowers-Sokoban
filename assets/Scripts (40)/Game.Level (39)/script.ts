namespace Game.Level
{
  let level: number = 1;

  // Getters
  export function get(): number
  {
    return ( level );
  }

  export function getNumber( level: string ): number
  {
    let maps = Sup.get( 'Levels', Sup.Folder ).children;
    for ( let map of maps )
    {
      let pos = map.indexOf( '.' );
      if ( pos > 0 && map.substr( pos + 1 ) == level )
        return ( parseInt( map.substr( 0, pos ) ) );
    }

    return ( 0 );
  }

  // Setters
  export function set( number: number )
  {
    level = number;
    level = ( level <= 0 ) ? 1 : level;

    if ( Game.debug )
      Sup.log( 'Game.Level.set( ' + level + ' )' );
  }

  export function plus( yes: boolean = true )
  {
    if ( yes )
      set( get() + 1 );
  }

  export function minus( yes: boolean = true )
  {
    if ( yes )
      set( get() - 1 );
  }

  export function setNumber( level: number, map?: Sup.TileMapRenderer ): number
  {
    let children = Sup.get( 'Levels', Sup.Folder ).children;
    if ( !map )
      map = Game.Map.get();

    for ( let child of children )
    {
      let pos = child.indexOf( '.' );
      if ( pos > 0 && child.substr( 0, pos ) == level.toString() )
      {
        Game.started( true );
        map.setTileMap( 'Levels/' + child );

        set( parseInt( child.substr( 0, pos ) ) );
        return ( get() );
      }
    }

    return ( 0 );
  }
}