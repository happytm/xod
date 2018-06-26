{{#global}}
#include <SPI.h>
#include <Ethernet2.h>
{{/global}}

struct State {
    EthernetClient client;
};

using Type = EthernetClient*;

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    auto state = getState(ctx);

    emitValue<output_OUT>(ctx, &state->client);
}
