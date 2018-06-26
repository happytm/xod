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
    auto serverIP = getValue<input_IP>(ctx);
    auto port = getValue<input_PORT>(ctx);

    if (client->connect(serverIP, port)) {
        emitValue<output_DONE>(ctx, 1);
    } else {
        emitValue<output_ERR>(ctx, 1);
    }
}
