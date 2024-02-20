import {
    EventBridgeClient,
    PutRuleCommand,
    PutRuleCommandInput, PutTargetsCommand,
    PutTargetsCommandInput
} from "@aws-sdk/client-eventbridge";
import {awsConfig} from "./AwsConfig";

//config from IAM user should have Policy related to EventBridge

const awsDetails = {
    ruleName: "test-scheduler-sdk",
    eventBridgeRole: "arn:aws:iam::542420031244:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_0ba81b0fa7",
    schedule: "rate(5 minutes)",
    targetLambda: "arn:aws:lambda:us-west-2:542420031244:function:test-logger"
}

const payload = {
    key1 : "value1-sdk- ok",
    key2 : "value2-sdk-ok",
    key3 : "value3-sdk-ok"
}

const client: EventBridgeClient = new EventBridgeClient(awsConfig);


const scheduledRuleRequest: PutRuleCommandInput = {
    Name: awsDetails.ruleName,
    ScheduleExpression: awsDetails.schedule,
    // EventPattern: "STRING_VALUE",
    State: "ENABLED",
    Description: "Test Scheduled Rule",
    RoleArn: awsDetails.eventBridgeRole, //NOTE: Selected Role should trust principal events.amazonaws.com https://stackoverflow.com/questions/59479734/role-cannot-be-assumed-by-events-amazonaws-com
    // EventBusName: "STRING_VALUE", //Omitting this will use default EventBus
};

const targetLambdaRequest: PutTargetsCommandInput = {
    Rule: awsDetails.ruleName,
    Targets: [
        {
            Id: "test-lambda-id",
            Arn: awsDetails.targetLambda,
            Input: JSON.stringify(payload)
        }
    ]
}

const putRuleCommand: PutRuleCommand = new PutRuleCommand(scheduledRuleRequest);
const putTargetsCommand: PutTargetsCommand = new PutTargetsCommand(targetLambdaRequest);

async function createScheduler() {
    try {
        console.log("Creating Scheduler")
        const ruleCreated = await client.send(putRuleCommand);
        console.log(ruleCreated);
        const targetPut = await client.send(putTargetsCommand);
        console.log(targetPut);
    } catch (error) {
        console.error(error);
    }
}

createScheduler();