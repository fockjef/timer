(global => {
    const webWorker = () => {
        let timers = {};
        onmessage = msg => {
            msg = msg.data;
            if( msg.type[0] === "c" ){
                // clearInterval/clearTimeout
                if( msg.id in timers ){
                    self[msg.type](timers[msg.id]);
                    delete timers[msg.id];
                }
            }
            else{
                // setInterval/setTimeout
                timers[msg.id] = self[msg.type](() => {
                    postMessage(msg.id);
                    if( msg.type === "setTimeout" ) delete timers[msg.id];
                }, msg.ms);
            }
        };
    };

    let timers = {},
        timerId = 0,
        webWorkerCode = webWorker.toString().replace(/^[^{]*\{|\}[^}]*$/g, ""),
        timekeeper = new Worker(URL.createObjectURL(new Blob([webWorkerCode], {type: "text/javascript"})));

    timekeeper.onmessage = msg => {
        if( msg.data in timers ){
            let {callback, args, type} = timers[msg.data];
            if( typeof callback !== "function" ) callback = new Function(callback);
            callback.apply(null, args);
            if( type === "setTimeout" ) delete timers[msg.data];
        }
    };

    ["clearInterval", "clearTimeout"].forEach(type => {
        global[type] = id => {
            if( id in timers ){
                delete timers[id];
                timekeeper.postMessage({type, id});
            }
        }
    });

    ["setInterval", "setTimeout"].forEach(type => {
        global[type] = (callback, ms, ...args) => {
            let id = ++timerId;
            timers[id] = {callback, args, type};
            timekeeper.postMessage({type, ms, id});
            return id;
        }
    });

    return global;
})(window);
