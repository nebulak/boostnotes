// Output Welcome message
output('Welcome to Boostnote Web-CLI.<br/><br/>')

var folders;
var notes;
var cwd = "";

$.getJSON("folders.json", function(_folders){
  folders = _folders;
});

$.getJSON("notes.json", function(_notes){
  notes = _notes;
});

function getFolderKey(name) {
  for(var i=0; i<folders.length; i++)
  {
    if(folders[i].name == name)
    {
      return folders[i].key;
    }
  }
  return null;
}


// User Commands
function ls () {
  if(cwd == "")
  {
    var folder_names = [];
    var sFolders = "";
    for(var i=0; i<folders.length; i++)
    {
      sFolders += folders[i].name + "<br/>";
    }
    return sFolders;
  }
  sNotes = "";
  var key = getFolderKey(cwd);
  for(var i=0; i<notes.length; i++)
  {
    if(notes[i].folder == key)
    {
      sNotes += "[" + i + "] " + notes[i].title + "<br/>";
    }
  }
  return sNotes;
}
ls.usage = "echo arg [arg ...]"
ls.doc = "Echos to output whatever arguments are input"



function cd (path) {
  console.log(path);

  for(var i=0; i<folders.length; i++)
  {
    if(folders[i].name == path)
    {
      cwd = path;
      return;
    }
  }
  if(path == ".." || isNaN(path))
  {
    cwd = "";
    return;
  }
  return "Error: Folder not found!<br/>"
}
cd.usage = "echo arg [arg ...]"
cd.doc = "Echos to output whatever arguments are input"


function search (token) {
  var found_notes = [];
  var sNotes = "";
  for(var i=0; i<notes.length; i++)
  {
    //check if we want to search for a tag
    if(token[0] == '#')
    {
      for (var j = 0; j < notes.length; j++)
      {
        try {
          if(notes[i].tags[j] == token)
          {
            sNotes += "[" + i + "] " + notes[i].title + "<br/>";
          }
        } catch (e) {

        }
      }
    }
    else
    {
      try {
        if( ((notes[i].content).indexOf(token) !== -1) || ((notes[i].title).indexOf(token) !== -1))
        {
          sNotes += "[" + i + "] " + notes[i].title + "<br/>";
        }
      } catch (e) {

      }

    }
  }

  if(sNotes == "")
  {
    return "<br/> No note found for search <br/>";
  }
  return sNotes;
}
search.usage = "search searchtoken"
search.doc = "search for notes containing token or tag"


function vw (num) {

  if(num < 0 && num >= notes.length)
  {
    return "<br/> Note not found <br/>";
  }
  var md = window.markdownit();
  var result = md.render(notes[num].content);
  return result;

}
vw.usage = "echo arg [arg ...]"
vw.doc = "Echos to output whatever arguments are input"


var cmds = {
  vw,
  cd,
  ls,
  clear,
  search,
  help
}

/*
 * * * * * * * * USER INTERFACE * * * * * * *
 */

function clear () {
  $("#outputs").html("")
}
clear.usage = "clear"
clear.doc = "Clears the terminal screen"

function help (cmd) {
  if (cmd) {
    let result = ""
    let usage = cmds[cmd].usage
    let doc = cmds[cmd].doc
    result += (typeof usage === 'function') ? usage() : usage
    result += "\n"
    result += (typeof doc === 'function') ? doc() : doc
    return result
  } else {
    let result = "**Commands:**\n\n"
    print = Object.keys(cmds)
    for (let p of print) {
      result += "- " + p + "\n"
    }
    return result
  }
}
help.usage = () => "help [command]"
help.doc = () => "Without an argument, lists available commands. If used with an argument displays the usage & docs for the command."

// Set Focus to Input
$('.console').click(function() {
  $('.console-input').focus()
})

// Display input to Console
function input() {
  var cmd = $('.console-input').val()
  $("#outputs").append("<div class='output-cmd'>" + cmd + "</div>")
  $('.console-input').val("")
  autosize.update($('textarea'))
  $("html, body").animate({
    scrollTop: $(document).height()
  }, 300);
  return cmd;
}

// Output to Console
function output(print) {
  /*
  if (!window.md) {
    window.md = window.markdownit({
      linkify: true,
      breaks: true
    })
  }
  */
  //$("#outputs").append(window.md.render(print))
  $("#outputs").append(print)
  $(".console").scrollTop($('.console-inner').height());
}

// Break Value
var newLine = "<br/> &nbsp;";

autosize($('textarea'))

var cmdHistory = []
var cursor = -1

// Get User Command
$('.console-input').on('keydown', function(event) {
  if (event.which === 38) {
    // Up Arrow
    cursor = Math.min(++cursor, cmdHistory.length - 1)
    $('.console-input').val(cmdHistory[cursor])
  } else if (event.which === 40) {
    // Down Arrow
    cursor = Math.max(--cursor, -1)
    if (cursor === -1) {
      $('.console-input').val('')
    } else {
      $('.console-input').val(cmdHistory[cursor])
    }
  } else if (event.which === 13) {
    event.preventDefault();
    cursor = -1
    let text = input()
    let args = getTokens(text)[0]
    let cmd = args.shift().value
    args = args.filter(x => x.type !== 'whitespace').map(x => x.value)
    cmdHistory.unshift(text)
    if (typeof cmds[cmd] === 'function') {
      let result = cmds[cmd](...args)
      if (result === void(0)) {
        // output nothing
      } else if (result instanceof Promise) {
        result.then(output)
      } else {
        console.log(result)
        output(result)
      }
    } else if (cmd.trim() === '') {
      output('')
    } else {
      output("Command not found: `" + cmd + "`")
      output("Use 'help' for list of commands.")
    }
  }
});

//ParticlesBG
particlesJS('particles-js',{'particles':{'number':{'value':50},'color':{'value':'#ffffff'},'shape':{'type':'triangle','polygon':{'nb_sides':5}},'opacity':{'value':0.06,'random':false},'size':{'value':11,'random':true},'line_linked':{'enable':true,'distance':150,'color':'#ffffff','opacity':0.4,'width':1},'move':{'enable':true,'speed':4,'direction':'none','random':false,'straight':false,'out_mode':'out','bounce':false}},'interactivity':{'detect_on':'canvas','events':{'onhover':{'enable':false},'onclick':{'enable':true,'mode':'push'},'resize':true},'modes':{'push':{'particles_nb':4}}},'retina_detect':true},function(){});
