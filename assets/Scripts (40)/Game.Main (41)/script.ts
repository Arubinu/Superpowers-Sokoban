namespace Game.Main
{
  let scene: Sup.Actor;
  let select: number = 0;
  let disabled = [ 2, 3 ];

  let delay: number;
  let keys: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

  export function getCode(): string
  {
    let code = '';
    let children = scene.getChild( 'Code' ).getChildren();
    for ( let child of children )
    {
      if ( child.getName().length == 1 )
        code += child.getChild( 'Letter' ).textRenderer.getText()[ 0 ];
    }

    return ( code );
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
/*
  export function setCode( code: string )
  {
    for ( let i = 1; i <= 4; ++i )
    {
      let child = scene.getChild( 'Code' ).getChild( i.toString() ).getChild( 'Letter' );
      child.textRenderer.setText( code[ i - 1 ] );
    }
  }
*/
  // Methods
  export function init( actor: Sup.Actor, preview: Sup.TileMapRenderer )
  {
    scene = actor;

    set( 0 );
    setPreview( preview );
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

  export function code( start?: boolean )
  {
    let scene_code = scene.getChild( 'Code' );
    if ( start )
    {
      if ( Game.debug )
        Sup.log( 'Game.Main.code()' );

      delay = 0;
      set( 0 );
      scene_code.setVisible( true );
    }

    ++delay;
    let up = Game.Keys.getUp();
    let down = Game.Keys.getDown();
    let left = Game.Keys.getLeft( true );
    let right = Game.Keys.getRight( true );
    plus( right && get() < 4 );
    minus( left && get() > 0 );

    if ( Sup.Input.wasTouchStarted( 0 ) )
       scene_code.getChild( 'OK' ).setVisible( true );

    let elems = new Array<Sup.Actor>();
    elems.push( scene_code.getChild( 'OK' ).getChild( 'Map' ) );
    for ( let i = 1; i <= 4; ++i )
    {
      let children = scene_code.getChild( i.toString() ).getChildren();
      for ( let child of children )
        elems.push( child );
    }

    let click = false;
    let valid = false;
    let hits = onClick( 'Camera', elems );
    for ( let hit of hits )
    {
      let parent = hit.actor.getParent().getName();
      Sup.log( parent, hit.actor.getName() );
      if ( parent.length == 1 )
      {
        click = true;
        let name = hit.actor.getName();
        up = ( name == 'ArrowUp' ) ? true : up;
        down = ( name == 'ArrowDown' ) ? true : down;

        let choice = parseInt( parent );
        if ( choice > 0 && choice <= 4 )
        {
          left = ( choice < get() ) ? true : left;
          right = ( choice > get() ) ? true : right;
          set( choice - 1 );
        }
      }
      else if (  hit.actor.getName() == 'Map' )
        valid = true;
    }

    let choice = scene_code.getChild( ( get() + 1 ).toString() ).getChild( 'Letter' );
    if ( start || up || down || left || right )
    {
      if ( !start && !click && delay < 8 )
        return ;

      delay = 0;
      if ( start || left || right )
      {
        let children = scene_code.getChildren();
        for ( let child of children )
        {
          if ( child.getName().length == 1 )
            child.getChild( 'Letter' ).textRenderer.setOpacity( .5 );
        }

        choice.textRenderer.setOpacity( 1 );
      }
      if ( up || down )
      {
        let letter = choice.textRenderer.getText()[ 0 ];
        let pos = keys.indexOf( letter );

        if ( up && pos > 0 )
          choice.textRenderer.setText( keys[ pos - 1 ] );
        else if ( down && pos >= 0 && pos < ( keys.length - 1 ) )
          choice.textRenderer.setText( keys[ pos + 1 ] );
      }
    }
    else if ( valid ||  Game.Keys.getEnter( true ) )
    {
      let level = Game.Level.getNumber( Game.Main.getCode() );
      if ( Game.debug )
        Sup.log( 'Game.code()', 'level: ' + level );

      if ( level )
      {
        Game.started( true );
        Game.Level.set( level );

        Game.behavior( true );
        Game.setMode( 2 );
      }
      else
        Game.setMode( 0 );
    }
    else if ( Game.Keys.getReturn( true ) )
      Game.setMode( 0 );
  }
}