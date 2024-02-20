import {
    ActionAfterCompletion,
    CreateScheduleCommand,
    CreateScheduleCommandInput, FlexibleTimeWindowMode,
    SchedulerClient, ScheduleState
} from "@aws-sdk/client-scheduler";
import {awsConfig} from "./AwsConfig";

const schedulerClient = new SchedulerClient(awsConfig);

const awsDetails = {
    scheduleName: "test-scheduler-sdk-onetime",
    eventBridgeRole: "arn:aws:iam::542420031244:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_0ba81b0fa7",
    schedule: "at(2024-02-15T09:25:00)", //Sets a one-time schedule "at(yyyy-mm-ddThh:mm:ss)"
    targetLambda: "arn:aws:lambda:us-west-2:542420031244:function:test-logger"
}

const payload = {
    key1 : "value1-sdk- ok-wew",
    key2 : "value2-sdk-ok-wew",
    key3 : "value3-sdk-ok-wew"
}

// const scheduleDetails = {
//     Name: awsDetails.scheduleName,
//     ScheduleExpression: awsDetails.schedule,
//     ScheduleExpressionTimezone: "Asia/Manila",
//     FlexibleTimeWindow: {
//         Mode: FlexibleTimeWindowMode.OFF
//     },
//     State: ScheduleState.ENABLED,
//     RoleArn: awsDetails.eventBridgeRole,
//     Target: {
//             Id: "test-lambda-id",
//             Arn: awsDetails.targetLambda,
//             RoleArn: awsDetails.eventBridgeRole,
//             Input: JSON.stringify(payload)
//     }
// }

const scheduleDetails: CreateScheduleCommandInput = {
    Name: awsDetails.scheduleName,
    ScheduleExpression: awsDetails.schedule,
    ActionAfterCompletion: ActionAfterCompletion.DELETE, //This deletes the schedule after the firing of event
    ScheduleExpressionTimezone: "Asia/Manila",
    FlexibleTimeWindow: {
        Mode: FlexibleTimeWindowMode.OFF
    },
    State: ScheduleState.ENABLED,
    Target: {
        Arn: awsDetails.targetLambda,
        RoleArn: awsDetails.eventBridgeRole,
        Input: JSON.stringify(payload)
    }
}

var createScheduleCommand = new CreateScheduleCommand(scheduleDetails);

async function createScheduler() {
    try {
        console.log("Creating Scheduler")
        const scheduleCreated = await schedulerClient.send(createScheduleCommand);
        console.log(scheduleCreated);
    } catch (error) {
        console.error(error);
    }
}

createScheduler().then(r => console.log("OK"));