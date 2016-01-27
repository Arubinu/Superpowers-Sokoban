namespace Game.Main
{
  let scene: Sup.Actor;
  let select: number = 0;
  let disabled = [ 2, 3 ];

  let preview: Sup.TileMapRenderer;

  // Getters
  export function get(): number
  {
    return ( select );
  }

  export function getPreview(): Sup.TileMapRenderer
  {
    return ( preview );
  }

  export function getDisabled(): number[]
  {
    return ( disabled );
  }

  // Setters
  export function set( number: number )
  {
    let length = Sup.getActor( 'Menu' ).getChildren().length;

    select = number;
    select = ( select < 0 ) ? ( length - 2 ) : select;
    select %= length - 1;
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

  export function setPreview( map: Sup.TileMapRenderer )
  {
    preview = map;
  }

  // Methods
  export function init( actor: Sup.Actor, preview: Sup.TileMapRenderer )
  {
    scene = actor;

    set( 0 );
    setPreview( preview );
    Game.Main.Code.init( scene.getChild( 'Code' ) );
  }

  export function behavior( start?: boolean )
  {
    if ( start )
    {
      if ( Game.debug )
        Sup.log( 'Game.Main.behavior()' );

      scene.getChild( 'Code' ).setVisible( false );
    }

    let menu = Sup.getActor( 'Menu' );
    let children = menu.getChildren();

    let up = Game.Keys.getUp( true );
    minus( up );
    let down = Game.Keys.getDown( true );
    plus( down );

    let click = 0;
    click = Sup.Input.wasMouseButtonJustPressed( 0 ) ? 1 : click;
    click = Sup.Input.wasTouchEnded( 0 ) ? 2 : click;

    let hits;
    let change = -1;
    if ( ( hits = onClick( 'Camera', 'Menu' ) ).length )
    {
      for ( let hit of hits )
      {
        change = children.indexOf( hit.actor );
        if ( change > 0 )
          break ;
      }
    }
    else if ( Game.Keys.getEnter( true ) )
      change = get() + 1;

    if ( change >= 0 && !( !Game.started() && getDisabled().indexOf( change ) >= 0 ) )
    {
      set( change - 1 );
      Game.setMode( change );
    }

    for ( let child of getDisabled() )
      menu.getChildren()[ child ].spriteRenderer.setOpacity( Game.started() ? 1 : .5 );

    Sup.getActor( 'Select' ).setLocalY( children[ get() + 1 ].getLocalY() - .05 );
  }
}