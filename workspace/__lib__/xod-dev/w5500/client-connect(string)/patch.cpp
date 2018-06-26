{{#global}}
#include <SPI.h>
#include <Ethernet2.h>
{{/global}}

struct State {
};

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    if (!isInputDirty<input_INIT>(ctx))
        return;

    auto client = getValue<input_CL>(ctx);
    auto serverName = getValue<input_SRV>(ctx);
    auto port = getValue<input_PORT>(ctx);

    auto len = length(serverName);
    char serverNameBuff[length(serverName) + 1] = { 0 };
    dump(serverName, serverNameBuff);
    serverNameBuff[len] = '\0';

    if (client->connect(serverNameBuff, port)) {
        emitValue<output_DONE>(ctx, 1);
    } else {
        emitValue<output_ERR>(ctx, 1);
    }
}
