namespace Game
{
  let scene: Sup.Actor;
  let start: boolean;
  let end: boolean;

  let mode: number;
  let items = [ 'Main', 'Game', 'Game', 'Game', 'Main', '', 'GameOver' ];

  let touch: boolean = false;
  let swipe: Sup.Math.Vector2;

  export let score: number;
  export const debug: boolean = false;

  export let change: boolean = false;

  // Getters
  export function getItems(): string[]
  {
    return ( items );
  }

  export function getMode(): number
  {
    return ( mode );
  }

  // Setters
  export function setMode( number: number )
  {
    if ( number < 0 || number >= getItems().length )
      return ;

    if ( !started() && Game.Main.getDisabled().indexOf( getMode() ) >= 0 )
      number = 0;

    if ( debug )
      Sup.log( 'Game.setMode( ' + number +' )' );

    mode = number;
    touch = false;
    change = true;
    for ( let child of getItems() )
    {
      if ( child.length )
        Sup.getActor( child ).setVisible( false );
    }

    if ( getItems()[ getMode() ].length )
      Sup.getActor( getItems()[ getMode() ] ).setVisible( true );
  }

  // Methods
  export function init( actor: Sup.Actor, map: Sup.TileMapRenderer, main: Sup.Actor, preview: Sup.TileMapRenderer )
  {
    start = false;
    end = false;

    score = 0;
    scene = actor;

    setMode( 0 );
    Game.Map.init( map );
    Game.Main.init( main, preview );
  }

  export function started( yes?: boolean ): boolean
  {
    if ( yes )
      start = true;

    return ( start );
  }

  export function ended(): boolean
  {
    let map = Game.Map.get().getTileMap();
    let w = map.getWidth();
    let h = map.getHeight();

    for ( let y = 0; y < h; ++y )
    {
      for ( let x = 0; x < w; ++x )
      {
        if ( map.getTileAt( 0, x, y ) == 1 && map.getTileAt( 1, x, y ) != 3 )
          return ( false );
      }
    }

    return ( true );
  }

  export function behavior( start?: boolean, next?: boolean )
  {
    let current = Game.Map.get();
    let preview = Game.Main.getPreview();

    if ( start )
    {
      score = 0;
      end = false;
      let temporary = scene.getChild( 'Temporary' ).tileMapRenderer;

      if ( next )
        Game.Level.plus();

      if ( debug )
        Sup.log( 'Game.behavior( ' + start + ', ' + next + ' )', 'level: ' + Game.Level.get() );

      if ( !Game.Level.setNumber( Game.Level.get(), temporary ) && next )
      {
        setMode( 6 );
        return ;
      }
      scene.getChild( 'Level' ).textRenderer.setText( 'Niveau ' + Game.Level.get() );
      scene.getChild( 'Score' ).textRenderer.setText( '' );
      scene.getChild( 'Code' ).textRenderer.setText( 'Code: ' + Game.Level.getCode() );

      let x = Math.round( ( current.getTileMap().getWidth() - temporary.getTileMap().getWidth() ) / 2 );
      let y = Math.round( ( current.getTileMap().getHeight() - temporary.getTileMap().getHeight() ) / 2 );

      Game.Map.clear();
      Game.Map.copy( current.getTileMap(), temporary.getTileMap(), { x: x, y: y } );
    }
    else if ( end )
    {
      if ( Game.Keys.getAll( true ) || Sup.Input.wasTouchStarted( 0 ) )
        behavior( true, true );
      else if ( Sup.Input.wasKeyJustPressed( 'ESCAPE' ) || Sup.Input.wasGamepadButtonJustPressed( 0, 1 ) )
      {
        Game.Main.set( 1 );
        Game.Map.clear( preview.getTileMap() );
        Game.Map.copy( preview.getTileMap(), current.getTileMap(), { x: 0, y: 0 } );

        setMode( 0 );
      }

      return ;
    }

    let map = current.getTileMap();
    if ( ended() )
    {
      let stats = Sup.Storage.getJSON( Game.Main.getCode() );
      stats = stats ? stats : { try: 0, move: 0 };

      Sup.Storage.setJSON( Game.Main.getCode(), { try: stats.try + 1, move: ( stats.move && stats.move <= score ) ? stats.move : score } );

      let result = 'Score actuel: ' + stats.move;
      if ( !stats.move || stats.move > Sup.Storage.getJSON( Game.Main.getCode() ).move )
        result = 'Nouveau score: ' + score;
      scene.getChild( 'Score' ).textRenderer.setText( 'Niveau terminé ! ' + result );

      end = true;
      return ;
    }

    let move = { x: 0, y: 0 };
    if ( Sup.Input.wasTouchEnded( 0 ) && touch )
    {
      if ( debug )
        Sup.log( 'Touch End' );

      touch = false;
      let pos = Sup.Input.getTouchPosition( 0 );
      if ( swipe && pos )
      {
        let x = swipe.x - pos.x;
        let y = swipe.y - pos.y;

        if ( Math.abs( x ) > Math.abs( y ) )
          move.x = ( x < 0 ) ? 1 : -1;
        else
          move.y = ( y < 0 ) ? 1 : -1;
      }
    }
    else if ( Sup.Input.wasTouchStarted( 0 ) )
    {
      touch = true;
      swipe = Sup.Input.getTouchPosition( 0 );
    }

    if ( Game.Keys.getUp( true ) )
      move.y = 1;
    else if ( Game.Keys.getDown( true ) )
      move.y = -1;
    else if ( Game.Keys.getLeft( true ) )
      move.x = -1;
    else if ( Game.Keys.getRight( true ) )
      move.x = 1;
    else if ( Game.Keys.getReturn( true ) )
    {
      Game.Main.set( 1 );
      Game.Map.clear( preview.getTileMap() );
      Game.Map.copy( preview.getTileMap(), current.getTileMap(), { x: 0, y: 0 } );

      setMode( 0 );
    }

    if ( move.x || move.y )
    {
      ++score;
      Game.Player.move( move );
    }
  }

  export function over( start?: boolean )
  {
    if ( Game.Keys.getAll( true ) )
      setMode( 0 );
  }
}